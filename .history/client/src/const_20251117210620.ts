export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID || "";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    // Prefer configured OAuth portal, fall back to current origin.
    const base = oauthPortalUrl || window.location.origin;
    const u = new URL(base);

    // Ensure we append the `app-auth` path correctly regardless of trailing slashes
    u.pathname = (u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "")) + "/app-auth";

    if (appId) u.searchParams.set("appId", appId);
    u.searchParams.set("redirectUri", redirectUri);
    u.searchParams.set("state", state);
    u.searchParams.set("type", "signIn");

    return u.toString();
  } catch (error) {
    // If URL construction fails, fall back to a safe local endpoint that the server can proxy.
    const fallback = new URL("/api/oauth/redirect-to-provider", window.location.origin);
    if (appId) fallback.searchParams.set("appId", appId);
    fallback.searchParams.set("redirectUri", redirectUri);
    fallback.searchParams.set("state", state);
    return fallback.toString();
  }
};
