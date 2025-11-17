# Copilot / AI Agent Instructions (Repository-specific)

Kurz: Dieses Projekt ist eine kombinierte Vite (Client) + Express/tRPC (Server) Anwendung mit Drizzle ORM und Stripe-Integration. Verwende `pnpm` und die in `package.json` definierten Skripte.

Key points for an AI coding agent:

- **Architecture & boundaries**: 
  - Client: `client/` (Vite + React + `client/src/main.tsx`, `client/index.html`). UI code lives in `client/src` and reusable components under `client/src/components`.
  - Server: `server/` (Express entry: `server/_core/index.ts`). The server exposes:
    - REST routes: `server/routes/*.ts` (e.g. `checkout.ts`, `stripe.ts`)
    - tRPC API: `appRouter` defined in `server/routers.ts` and implemented via `server/_core/trpc` and `server/_core/systemRouter`.
    - OAuth and session helpers under `server/_core` (see `oauth.ts`, `cookies.ts`, `context.ts`).
  - DB: Drizzle ORM schema in `drizzle/schema.ts` and migration helpers in `drizzle/`.
  - Shared types/constants: `shared/` is the single source for cross-cutting types and constants (imports use the `@shared/*` path alias from `tsconfig.json`).

- **Development workflow (exact commands)**:
  - Install deps: `pnpm install` (this repo uses `pnpm` as `packageManager`)
  - Start dev server (server + client via Vite middleware):
    - `pnpm dev` — runs `tsx watch server/_core/index.ts`. In development the server mounts Vite middleware (`server/_core/vite.ts`) so both client and server reload together.
  - Build for production: `pnpm build` — runs `vite build` (client) then `esbuild` to bundle the server entry (`server/_core/index.ts`) into `dist/`.
  - Start production build: `pnpm start` (runs `node dist/index.js`).
  - Run type checks: `pnpm run check` (calls `tsc --noEmit`).
  - Run tests: `pnpm test` (vitest).
  - DB migrations/generation: `pnpm run db:push` (calls `drizzle-kit generate && drizzle-kit migrate`).

- **Important runtime details & gotchas**:
  - Environment variables are read via `dotenv` and exposed in `server/_core/env.ts`. Key names used here include: `VITE_APP_ID`, `JWT_SECRET`, `DATABASE_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, and `NODE_ENV`.
  - Stripe webhooks require the raw body. `server/_core/index.ts` explicitly registers the webhook route before `express.json()` to preserve the raw payload: `app.post('/api/stripe/webhook', express.raw(...))`.
  - Dev server will try to use `PORT` (default 3000) and will pick a nearby available port if occupied — see port probe logic in `server/_core/index.ts`.
  - Vite middleware: in development the server uses `setupVite()` (`server/_core/vite.ts`) which proxies and serves the client. In production static assets are served from `dist/public`.

- **Code patterns & conventions unique to this repo**:
  - All API endpoints are under `/api/*` (REST and tRPC) — see `server/_core/index.ts` and the comment in `server/routers.ts`. This matters for routing and any gateway/proxy logic.
  - tRPC router composition: feature routers are attached to `appRouter` (`server/routers.ts`). Use `publicProcedure` / `protectedProcedure` patterns defined in `server/_core/trpc`.
  - Project uses path aliases configured in `tsconfig.json`: `@/*` -> `client/src/*` and `@shared/*` -> `shared/*`.
  - Server bundling: the `build` pipeline expects the client to be built first (`vite build`) and then bundles the server via `esbuild`. Keep changes to server entrypoints minimal or update the `esbuild` call if adding node-specific dependencies.
  - Patches and pinned packages: `pnpm` patched dependencies are stored under `patches/` and referenced in `package.json` (e.g. `wouter@3.7.1.patch`). Respect these when updating deps.

- **Where to look when changing behavior**:
  - Startup & middleware: `server/_core/index.ts` and `server/_core/vite.ts`.
  - API surface: `server/routes/`, `server/routers.ts`, `server/_core/trpc.ts` and `server/_core/systemRouter.ts`.
  - Database: `drizzle/schema.ts`, `drizzle/relations.ts`, and `drizzle/migrations/`.
  - Shared contracts: `shared/` (types and `const.ts`).

- **When creating PRs or making changes**:
  - Keep `@shared` types stable — many server and client modules import from `@shared/*`.
  - If you modify DB schema, run `pnpm run db:push` locally and include migration files.
  - Use `pnpm build` and `pnpm start` to validate production bundling (server is esbuild-bundled).

If you want, I can iterate this file to include sample env files, a trimmed checklist for a new feature, or add quick links to the most important functions. Ist etwas unklar oder fehlt ein Bereich? Sag mir, welche Details du ergänzt haben möchtest.
