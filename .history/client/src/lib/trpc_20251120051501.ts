import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

/**
 * Bestimme die tRPC API-URL basierend auf Umgebung
 * - Production: VITE_API_URL aus .env oder prostarmarketing.de
 * - Development: localhost:3000
 */
export function getTrpcUrl(): string {
  if (import.meta.env.PROD) {
    // Production Mode: Verwende VITE_API_URL oder Subdomain-basiert
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      return `${apiUrl}/api/trpc`;
    }
    // Fallback: Nutze aktuelle Domain + /api/trpc
    const origin = window.location.origin;
    return `${origin}/api/trpc`;
  }
  // Development Mode: localhost
  return "http://localhost:3003/api/trpc";
}

/**
 * tRPC Client - direct without React Query
 * Simple HTTP client for course registration
 */
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
      credentials: "include",
    }),
  ],
});
