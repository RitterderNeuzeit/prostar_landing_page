import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  const hostname = req.hostname;
  const isLocal = LOCAL_HOSTS.has(hostname) || isIpAddress(hostname);
  
  // For iframe embedding in Squarespace, we need:
  // 1. sameSite: 'none' (allows cross-site cookies)
  // 2. secure: true (required for sameSite: 'none')
  // 3. No domain restriction (or correct domain)
  
  const isProduction = process.env.NODE_ENV === 'production';
  const isSquarespaceContext = req.headers.referer?.includes('squarespace.com');
  
  // In iframe context (Squarespace embedding), use strict settings
  if (isProduction || isSquarespaceContext) {
    return {
      httpOnly: true,
      path: "/",
      sameSite: "none", // Required for iframe/cross-site
      secure: true, // Required when sameSite='none'
      domain: undefined // Let browser handle domain
    };
  }
  
  // Local development
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax", // More permissive for local dev
    secure: isSecureRequest(req),
    domain: undefined
  };
}
