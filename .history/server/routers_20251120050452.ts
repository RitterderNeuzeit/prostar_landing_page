import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { registerForCourse, verifyAccessKey } from "./services/courseService";
import { sendCourseAccessEmail, isEmailServiceConfigured } from "./services/emailService";

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
    register: publicProcedure
      .input(
        z.object({
          name: z.string().min(2).max(255),
          email: z.string().email(),
          courseName: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Check email service
          if (!isEmailServiceConfigured()) {
            return {
              success: false,
              error: "Email service is not configured",
              message: "Registration failed: Email system offline",
            };
          }

          // Register user
          const registration = await registerForCourse({
            name: input.name,
            email: input.email,
            courseName: input.courseName,
          });

          // Send email with access key
          const emailResult = await sendCourseAccessEmail({
            name: input.name,
            email: input.email,
            accessKey: registration.accessKey,
            courseName: registration.registration?.courseName || "free-mini-course",
            expiresAt: registration.expiresAt,
          });

          return {
            success: true,
            message: `Access email sent to ${input.email}`,
            accessKey: registration.accessKey,
            expiresAt: registration.expiresAt,
            emailSent: emailResult.success,
          };
        } catch (error) {
          console.error("Course registration error:", error);
          return {
            success: false,
            error: "Registration failed",
            message: "An error occurred during registration",
          };
        }
      }),

    verify: publicProcedure
      .input(z.object({ accessKey: z.string() }))
      .query(async ({ input }) => {
        try {
          const result = await verifyAccessKey(input.accessKey);
          if (result.valid) {
            return {
              valid: true,
              name: result.name,
              email: result.email,
              courseName: result.courseName,
              expiresAt: result.expiresAt,
            };
          }
          return {
            valid: false,
            error: result.error,
          };
        } catch (error) {
          console.error("Verification error:", error);
          return {
            valid: false,
            error: "Verification failed",
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
