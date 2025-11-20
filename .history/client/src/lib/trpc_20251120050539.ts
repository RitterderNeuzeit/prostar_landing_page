import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient } from "@tanstack/react-query";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

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

/**
 * Create tRPC client with query client
 */
export function createTrpcClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: getTrpcUrl(),
        credentials: "include",
      }),
    ],
  });

  return { trpcClient, queryClient };
}

/**
 * Export a pre-configured trpc client for direct usage
 */
export const { trpcClient, queryClient } = createTrpcClient();
