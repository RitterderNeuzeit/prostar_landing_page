import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { registerForCourse, verifyAccessKey, markEmailSent } from "../services/courseServiceDB";
import { sendCourseAccessEmail, isEmailServiceConfigured } from "../services/emailService";
import { finalizeRegistration } from "../services/accountService";
import { verifyCaptcha } from "../services/captchaService";

export const registrationRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name erforderlich"),
        email: z.string().email("Ungültige Email"),
        courseName: z.string().optional(),
        captchaToken: z.string().optional(),
        honeypot: z.string().optional(),
        formStartedAt: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.honeypot) {
        return { success: false, error: "Spam erkannt" } as const;
      }
      if (input.formStartedAt && Date.now() - input.formStartedAt < 1500) {
        return { success: false, error: "Formular zu schnell abgesendet" } as const;
      }
      const captcha = await verifyCaptcha(input.captchaToken);
      if (!captcha.valid) {
        return { success: false, error: "Captcha ungültig" } as const;
      }
      const { name, email, courseName } = input;
      const regResult = await registerForCourse({ name, email, courseName });

      let emailStatus: { success: boolean; messageId?: string; error?: string } | null = null;
      if (isEmailServiceConfigured()) {
        emailStatus = await sendCourseAccessEmail({
          name,
          email,
          accessKey: regResult.accessKey,
          courseName: regResult.registration?.courseName || courseName || "free-mini-course",
          expiresAt: regResult.expiresAt,
        });
      } else {
        emailStatus = { success: false, error: "Email-Service nicht konfiguriert" };
        console.warn("⚠️ Email Versand übersprungen: Service nicht konfiguriert");
      }

      return {
        success: regResult.success,
        accessKey: regResult.accessKey,
        expiresAt: regResult.expiresAt,
        email: email,
        emailSent: emailStatus.success,
        emailError: emailStatus.success ? undefined : emailStatus.error,
      } as const;
    }),
  verify: publicProcedure
    .input(
      z.object({
        email: z.string().email("Ungültige Email"),
        accessKey: z.string().min(10, "Ungültiger Code"),
      })
    )
    .mutation(async ({ input }) => {
      const result = await verifyAccessKey(input.email, input.accessKey);
      return result;
    }),
  finalize: publicProcedure
    .input(
      z.object({
        email: z.string().email("Ungültige Email"),
        accessKey: z.string().min(10, "Ungültiger Code"),
        password: z.string().min(8, "Passwort zu kurz"),
        name: z.string().optional(),
        captchaToken: z.string().optional(),
        honeypot: z.string().optional(),
        formStartedAt: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.honeypot) {
        return { success: false, error: "Spam erkannt" } as const;
      }
      if (input.formStartedAt && Date.now() - input.formStartedAt < 2000) {
        return { success: false, error: "Formular zu schnell" } as const;
      }
      const captcha = await verifyCaptcha(input.captchaToken);
      if (!captcha.valid) {
        return { success: false, error: "Captcha ungültig" } as const;
      }
      const result = await finalizeRegistration(input);
      return result;
    }),
});
