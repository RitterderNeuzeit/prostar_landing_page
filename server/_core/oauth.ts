import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // Fallback helper for clients when no external OAuth portal is configured.
  // Redirects to the configured OAuth portal (server env) or returns 400.
  app.get("/api/oauth/redirect-to-provider", (req: Request, res: Response) => {
    const redirectUri = getQueryParam(req, "redirectUri") || `${req.protocol}://${req.get("host")}/api/oauth/callback`;
    const state = getQueryParam(req, "state") || "";
    const appId = getQueryParam(req, "appId") || "";

    const portal = process.env.OAUTH_SERVER_URL || process.env.VITE_OAUTH_PORTAL_URL || "";
    if (!portal) {
      res.status(400).json({ error: "No OAuth portal configured on server" });
      return;
    }

    try {
      const base = portal.replace(/\/$/, "");
      const url = new URL(base);
      url.pathname = (url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "")) + "/app-auth";
      if (appId) url.searchParams.set("appId", appId);
      url.searchParams.set("redirectUri", redirectUri);
      if (state) url.searchParams.set("state", state);
      url.searchParams.set("type", "signIn");

      res.redirect(302, url.toString());
    } catch (err) {
      console.error("[OAuth] redirect-to-provider failed", err);
      res.status(500).json({ error: "Failed to construct redirect URL" });
    }
  });
}
