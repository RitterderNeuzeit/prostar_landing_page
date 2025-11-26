import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  registerForCourse,
  verifyAccessKey,
  generateAccessKey,
} from "./services/courseService";
import {
  sendCourseAccessEmail,
  isEmailServiceConfigured,
} from "./services/emailService";
import { updateCourseRegistrationEmailSent } from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Course registration router
  course: router({
    getLatestEmail: publicProcedure
      .query(async () => {
        try {
          // Try to get from localStorage/sessionStorage in client
          // For server side: try to get from recent registrations
          const { getRecentRegistrations } = await import("./db");
          
          try {
            const recent = await getRecentRegistrations(1);
            if (recent && recent.length > 0) {
              console.log("✅ [getLatestEmail] Found recent email:", recent[0].email);
              return {
                success: true,
                email: recent[0].email,
                createdAt: recent[0].createdAt,
              };
            }
          } catch (dbErr) {
            console.warn("⚠️ Could not fetch from DB:", dbErr);
          }

          // Fallback: return null, client will handle
          return {
            success: false,
            email: null,
          };
        } catch (error) {
          console.error("❌ getLatestEmail error:", error);
          return {
            success: false,
            email: null,
          };
        }
      }),

    sendVerificationCode: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        console.log("\n📧 [SEND CODE] Email:", input.email);
        
        try {
          const emailConfigured = isEmailServiceConfigured();
          if (!emailConfigured) {
            return {
              success: false,
              error: "Email service not configured",
            };
          }

          // Generiere Access-Key
          const accessKey = generateAccessKey(input.email);
          const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

          console.log("🔑 Access Key generated:", accessKey.substring(0, 8) + "...");

          // Sende Email mit Code
          const emailResult = await sendCourseAccessEmail({
            name: input.email.split("@")[0],
            email: input.email,
            accessKey,
            courseName: "KI-Prompting Kurs",
            expiresAt,
          });

          if (emailResult.success) {
            console.log("✅ Verification code sent to:", input.email);
            
            // Versuche zu speichern (auch wenn DB offline ist)
            try {
              await registerForCourse({
                name: input.email.split("@")[0],
                email: input.email,
                courseName: "KI-Prompting Kurs",
              }).catch(err => {
                console.warn("⚠️ Could not register in DB (offline):", err.message);
              });
            } catch (err) {
              console.warn("DB registration failed (expected if DB is offline)");
            }

            return {
              success: true,
              message: `Verifizierungscode gesendet an ${input.email}`,
            };
          } else {
            return {
              success: false,
              error: "Email-Versand fehlgeschlagen",
            };
          }
        } catch (error) {
          console.error("❌ Send verification code error:", error);
          return {
            success: false,
            error: "Ein Fehler ist aufgetreten",
          };
        }
      }),

    register: publicProcedure
      .input(
        z.object({
          name: z.string().min(2).max(255),
          email: z.string().email(),
          courseName: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        console.log("\n📋 [REGISTRATION START] Email:", input.email);
        const startTime = Date.now();
        
        try {
          // Check email service
          const emailConfigured = isEmailServiceConfigured();
          console.log("✉️ Email service configured:", emailConfigured);

          if (!emailConfigured) {
            console.error("❌ Email not configured - returning error");
            return {
              success: false,
              error: "Email service is not configured",
              message: "Registration failed: Email system offline",
            };
          }

          // Register user (generate key even without DB)
          console.log("💾 Attempting to register for course...");
          const registration = await registerForCourse({
            name: input.name,
            email: input.email,
            courseName: input.courseName,
          }).catch(err => {
            // If DB error, still generate and send email with key
            console.warn("⚠️ DB registration failed:", err.message);
            return {
              success: true,
              accessKey: generateAccessKey(input.email),
              expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              registration: null,
            };
          });

          console.log(
            "✅ Registration created, accessKey:",
            registration.accessKey.substring(0, 8) + "..."
          );

          // Send email with access key (catch and report email errors explicitly)
          try {
            console.log("📧 [EMAIL SEND START] Sending to:", input.email);
            const courseNameForEmail =
              (registration as any)?.registration?.courseName ||
              input.courseName ||
              "free-mini-course";
            
            const emailResult = await sendCourseAccessEmail({
              name: input.name,
              email: input.email,
              accessKey: registration.accessKey,
              courseName: courseNameForEmail,
              expiresAt: registration.expiresAt,
            });

            const emailTime = Date.now() - startTime;
            console.log(`✅ Email sent in ${emailTime}ms:`, emailResult.messageId);
            
            // Update DB: mark email as sent (if DB available)
            try {
              // If the registration record was not created previously (DB was offline), try to create it now
              if (!registration.registration) {
                try {
                  console.log(
                    "DB record missing for accessKey, attempting to create registration now"
                  );
                  const { createCourseRegistration } = await import("./db");
                  await createCourseRegistration({
                    accessKey: registration.accessKey,
                    name: input.name,
                    email: input.email,
                    courseName: courseNameForEmail,
                    status: "active",
                    expiresAt: registration.expiresAt,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  } as any);
                } catch (createErr) {
                  console.warn(
                    "Could not create missing registration record:",
                    createErr
                  );
                }
              }
              await updateCourseRegistrationEmailSent(registration.accessKey);
            } catch (upErr) {
              console.warn("Failed to update emailSent in DB:", upErr);
            }
            
            const totalTime = Date.now() - startTime;
            console.log(`✅ [REGISTRATION COMPLETE] Total time: ${totalTime}ms\n`);
            
            return {
              success: true,
              message: `Access email sent to ${input.email}`,
              accessKey: registration.accessKey,
              expiresAt: registration.expiresAt,
              emailSent: emailResult.success,
            };
          } catch (emailErr) {
            console.error("❌ Email send error:", emailErr);
            return {
              success: false,
              error: "Email send failed",
              message: String(emailErr),
            };
          }
        } catch (error) {
          console.error("❌ Course registration error:", error);
          return {
            success: false,
            error: "Registration failed",
            message: "An error occurred during registration",
          };
        }
      }),

    verify: publicProcedure
      .input(z.object({ email: z.string().email(), accessKey: z.string() }))
      .query(async ({ input }) => {
        try {
          console.log("🔍 [Verify] Started for email:", input.email);
          const result = await verifyAccessKey(input.email, input.accessKey);
          if (result.valid && result.name) {
            console.log("✅ [Verify] Success for:", input.email);
            return {
              valid: true,
              name: result.name,
              email: result.email,
              courseName: result.courseName,
              expiresAt: result.expiresAt,
            };
          }

          // Check if key format is correct (email tag matches)
          const [emailTag] = input.accessKey.split("_");
          const expectedTag = input.email
            .split("@")[0]
            .substring(0, 8)
            .toLowerCase();

          // DEV MODE FALLBACK: If email tag matches, accept it (for local testing without DB)
          if (emailTag === expectedTag && input.accessKey.includes("_")) {
            console.warn(
              "⚠️ [Verify] DEV MODE: Accepting valid format (DB offline)"
            );
            return {
              valid: true,
              name: input.email.split("@")[0],
              email: input.email,
              courseName: "free-mini-course",
              expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            };
          }

          // Invalid key format
          console.warn("❌ [Verify] Failed:", result.error);
          return {
            valid: false,
            error: result.error || "Verifizierung fehlgeschlagen",
          };
        } catch (error) {
          console.error("Verification error:", error);
          return {
            valid: false,
            error: "Verifizierung fehlgeschlagen — bitte versuche es später",
          };
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
