import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { registerForCourse, verifyAccessKey } from "../services/courseService";
import { sendCourseAccessEmail, isEmailServiceConfigured } from "../services/emailService";

export const registrationRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name erforderlich"),
        email: z.string().email("Ungültige Email"),
        courseName: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
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
});
