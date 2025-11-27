import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { requestPasswordReset, completePasswordReset } from "../services/passwordResetServiceDB";
import { sendPasswordResetEmail, isEmailServiceConfigured } from "../services/emailService";
import { verifyCaptcha } from "../services/captchaService";

export const passwordResetRouter = router({
  /**
   * Request password reset - sends email with token
   */
  request: publicProcedure
    .input(
      z.object({
        email: z.string().email("Ungültige Email"),
        captchaToken: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Verify captcha
      const captcha = await verifyCaptcha(input.captchaToken);
      if (!captcha.valid) {
        return { success: false, error: "Captcha ungültig" } as const;
      }

      // Generate reset token
      const result = await requestPasswordReset(input.email);
      if (!result.success || !result.token) {
        // Always return success to prevent user enumeration
        return { success: true } as const;
      }

      // Send email
      if (isEmailServiceConfigured()) {
        const emailResult = await sendPasswordResetEmail({
          email: input.email,
          token: result.token,
          expiresAt: result.expiresAt!,
        });
        
        if (!emailResult.success) {
          console.error('[Reset] Failed to send email:', emailResult.error);
          return { success: false, error: "E-Mail konnte nicht gesendet werden" } as const;
        }
      } else {
        console.warn('[Reset] Email service not configured');
        return { success: false, error: "E-Mail Service nicht konfiguriert" } as const;
      }

      return { success: true } as const;
    }),

  /**
   * Complete password reset with token
   */
  reset: publicProcedure
    .input(
      z.object({
        token: z.string().min(10, "Ungültiger Token"),
        newPassword: z.string().min(8, "Passwort zu kurz"),
        captchaToken: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Verify captcha
      const captcha = await verifyCaptcha(input.captchaToken);
      if (!captcha.valid) {
        return { success: false, error: "Captcha ungültig" } as const;
      }

      // Complete reset
      const result = await completePasswordReset(input.token, input.newPassword);
      return result;
    }),
});
