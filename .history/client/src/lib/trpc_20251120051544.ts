import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCProxyClient } from "@trpc/client";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

/**
 * tRPC Client für Direct Usage (ohne React Query)
 * Z.B. für Course Registration Forms
 */
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getTrpcUrl(),
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

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
  return "http://localhost:3000/api/trpc";
}
