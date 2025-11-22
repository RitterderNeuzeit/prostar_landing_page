import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCProxyClient } from "@trpc/client";
import superjson from "superjson";
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
      transformer: superjson,
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
  // Development Mode: localhost (Port dynamisch aus .env oder Fallback 3001)
  const devPort = import.meta.env.VITE_DEV_PORT || "3001";
  return `http://localhost:${devPort}/api/trpc`;
}
