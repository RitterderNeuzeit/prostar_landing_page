## Kurzanleitung für AI-Copiloten (Repository-spezifisch)

Kurz: Dieses Projekt kombiniert Vite (Client) mit einem Express/tRPC-Server, verwendet Drizzle ORM für die DB und hat eine Stripe-Integration. Verwende `pnpm` und die Skripte aus `package.json`.

**Architektur & Abgrenzungen**
- Client: `client/` (Vite + React). Einstieg: `client/src/main.tsx` und `client/index.html`. UI-Komponenten in `client/src/components`.
- Server: `server/` (Express-Entry: `server/_core/index.ts`). Wichtige Teile:
  - REST: `server/routes/*.ts` (z.B. `checkout.ts`, `stripe.ts`).
  - tRPC: `appRouter` in `server/routers.ts`, Implementierungen in `server/_core/trpc.ts` und `server/_core/systemRouter.ts`.
  - OAuth, Sessions, Context: `server/_core/oauth.ts`, `cookies.ts`, `context.ts`.
- DB: Drizzle-Schema in `drizzle/schema.ts`. Migrationen unter `drizzle/migrations/`.
- Shared: `shared/` enthält gemeinsame Typen und Konstanten; Pfad-Alias `@shared/*` ist in `tsconfig.json` definiert.

**Entwickler-Workflows (exakte Befehle)**
- Abhängigkeiten installieren: `pnpm install`
- Dev (Server + Vite-Middleware): `pnpm dev` (führt `tsx watch server/_core/index.ts` aus).
- Build (Prod): `pnpm build` — baut Client mit `vite build`, dann bundlet `esbuild` den Server (`server/_core/index.ts`) nach `dist/`.
- Start Produktion: `pnpm start` (führt `node dist/index.js` aus).
- Type-Check: `pnpm run check` (`tsc --noEmit`).
- Tests: `pnpm test` (Vitest).
- DB-Migration/Generierung: `pnpm run db:push` (`drizzle-kit generate && drizzle-kit migrate`).

**Laufzeit-Details / Gotchas**
- Env-Variablen werden mit `dotenv` geladen; zentrale Datei: `server/_core/env.ts`. Wichtige Keys: `VITE_APP_ID`, `JWT_SECRET`, `DATABASE_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `NODE_ENV`.
- Stripe-Webhooks brauchen den rohen Request-Body. Deshalb registriert `server/_core/index.ts` die Route `app.post('/api/stripe/webhook', express.raw(...))` bevor `express.json()` verwendet wird.
- Dev-Server resoviert `PORT` (Standard `3000`) und sucht proaktiv einen freien Port, falls belegt — siehe `findAvailablePort` in `server/_core/index.ts`.
- In Development verwendet der Server Vite-Middleware (`server/_core/vite.ts`); in Production werden statische Assets aus `dist/public` bedient.

**Projekt-spezifische Patterns**
- Alle APIs unter `/api/*` (REST + tRPC). Achte bei Änderungen an Routen auf diesen Prefix.
- tRPC: Router werden modular an `appRouter` gehängt; nutze `publicProcedure`/`protectedProcedure` aus `server/_core/trpc`.
- Pfad-Aliase: `@/*` → `client/src/*`, `@shared/*` → `shared/*` (siehe `tsconfig.json`).
- pnpm-Patches: gefixte Pakete liegen in `patches/` und sind in `package.json` referenziert (z. B. `wouter@3.7.1.patch`). Nicht entfernen.

**Wichtige Dateien zum Ändern / Prüfen**
- Server-Startup & Middleware: `server/_core/index.ts`, `server/_core/vite.ts`.
- API-Oberfläche: `server/routes/`, `server/routers.ts`, `server/_core/trpc.ts`, `server/_core/systemRouter.ts`.
- DB: `drizzle/schema.ts`, `drizzle/relations.ts`, `drizzle/migrations/`.
- Shared-Typen: `shared/` (`const.ts`, `types.ts`).

**Beim Erstellen von PRs**
- `@shared`-Typen stabil halten — viele Module importieren diese.
- Bei Schema-Änderungen: lokal `pnpm run db:push` ausführen und Migrationsdateien mitschicken.
- Prüfe Production-Build: `pnpm build` und `pnpm start`.

Ich kann die Datei noch um ein Beispiel-`.env` erweitern oder eine kurze PR-Checkliste hinzufügen. Möchtest du, dass ich eine `./.env.example` anlege? (Ja/Nein)
