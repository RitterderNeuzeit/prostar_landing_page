import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import bcrypt from "bcryptjs";
import { sdk } from "../_core/sdk";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";

export const localAuthRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Ungültige Email"),
        password: z.string().min(8, "Passwort zu kurz"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.getUserByEmail(input.email.toLowerCase());
      if (!user || !user.passwordHash) {
        return { success: false, error: "Benutzer nicht gefunden" } as const;
      }
      const ok = await bcrypt.compare(input.password, user.passwordHash);
      if (!ok) {
        return { success: false, error: "Ungültige Zugangsdaten" } as const;
      }
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "",
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      return { success: true } as const;
    }),
});
