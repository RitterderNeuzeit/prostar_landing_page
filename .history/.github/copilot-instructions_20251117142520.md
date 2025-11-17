## Kurzanleitung für AI-Copiloten (kurz & auf Deutsch)

Kurz: Vite-Client (`client/`) + Express/tRPC-Server (`server/`), Drizzle-ORM für die DB, Stripe-Integration. Verwende `pnpm`.

Wichtige Orte (schnell):
- Server-Start & Middleware: `server/_core/index.ts`, `server/_core/vite.ts`
- API: `server/routes/`, `server/routers.ts`, `server/_core/trpc.ts`
- DB-Schema: `drizzle/schema.ts`, `drizzle/migrations/`
- Shared-Typen/Konstanten: `shared/` (Pfad-Alias `@shared/*`)

Unverzichtbare Befehle:
## AI-Copilot Anleitung (Deutsch, kompakt)

Kurzüberblick
- Architektur: SPA-Frontend mit Vite (`client/`) + Express-Server mit tRPC (`server/`). Datenbank: Drizzle-ORM (`drizzle/`). Zahlungsintegration: Stripe (`server/routes/stripe`). Paketmanager: `pnpm`.

Wesentliche Orte (schnell)
- Server-Start & Middleware: `server/_core/index.ts` (Port-Fallback, body-parser, webhook-setup).
- Vite-Dev-Integration: `server/_core/vite.ts` (dev middleware, HMR, index.html transformation).
- API-Registrierung: `server/routers.ts` (exportiert `appRouter` für `/api/trpc`).
- Routen: `server/routes/*` (z.B. `checkout`, `stripe`).
- DB: `drizzle/schema.ts`, `drizzle/migrations/`.
- Shared-Typen/Konstanten: `shared/` (Pfad-Alias `@shared/*`).

Wichtige Befehle (konkret)
```
pnpm install
pnpm dev         # Development: startet server via tsx watch (server/_core/index.ts) + Vite middleware
pnpm run check   # TypeScript: tsc --noEmit
pnpm build       # Client: vite build; Server: esbuild bundling (siehe package.json)
pnpm start       # Startet gebundleserver: node dist/index.js
pnpm test        # Runs vitest
pnpm run db:push # drizzle-kit generate && drizzle-kit migrate (DB-Migration)
```

Konkrete, repo-spezifische Hinweise
- Stripe Webhook: Die Route `/api/stripe/webhook` wird bewusst VOR `express.json()` mit `express.raw({type:'application/json'})` registriert. Bei Änderungen an Stripe-Handling niemals die Reihenfolge ändern (siehe `server/_core/index.ts`).
- tRPC: Alle tRPC-Endpoints werden über `appRouter` in `server/routers.ts` exportiert und sind unter `/api/trpc` erreichbar. Neue feature-router bitte in `server/routers.ts` anfügen.
- Dev/Prod-Mode: Im Development-Modus wird Vite als Middleware eingebunden (`setupVite`), im Production-Mode werden statische Dateien aus `dist/public` bedient (`serveStatic`).
- Server-Build: `pnpm build` führt zuerst `vite build` (Client) und dann `esbuild` für `server/_core/index.ts` aus. Produktions-Startpunkt ist `dist/index.js`.
- Port-Logik: Server versucht `PORT` (default 3000) und sucht ein freies Port+Fallback (siehe `findAvailablePort` in `server/_core/index.ts`). Tests und lokale Devs müssen das berücksichtigen.
- Pfad-Aliasse: `@shared/*` → `shared/`; Frontend-Quellen unter `client/src/` (Entry: `client/index.html` → `src/main.tsx`).
- Patches: `pnpm`-patched dependencies sind in `patches/` (`package.json` referenziert z.B. `wouter@3.7.1`).

Beispiele / How-To (konkret)
- Neue REST-Route: Erstelle `server/routes/<name>.ts` und `app.use('/api/<name>', <route>)` in `server/_core/index.ts`.
- Neue tRPC-Route: In `server/routers.ts` einen neuen `router({ ... })` hinzufügen und in `appRouter` exportieren; auf Client mit `@trpc/client` den `api/trpc/<router>`-Pfad verwenden.
- DB-Änderung: Schema in `drizzle/schema.ts` anpassen → `pnpm run db:push` lokal ausführen → Migrationsdateien prüfen und committen.

Debugging & Tests
- Dev-Server logs erscheinen in Konsole; bei HMR-Problemen zuerst prüfen, ob `server/_core/vite.ts` korrekt die `vite.middlewares` verwendet.
- Unit/E2E: `pnpm test` (Vitest). Für Typescript-Fehler: `pnpm run check`.

PR-Checkliste (kurz & konkret)
- Ändere `@shared`-Typen nur wenn notwendig und dokumentiere Breaking-Changes.
- Bei DB-Änderungen: `pnpm run db:push` lokal und migrations mitschicken.
- Stripe-Code: Webhook-Reihenfolge & Secret nicht versehentlich ins Repo committen.

Make-it-actionable
- Wenn etwas unklar ist, sag mir welche Datei du ändern willst (z.B. `server/routes/stripe.ts`) — ich kann einen PR-Vorschlag oder Patch erstellen.

Feedback
- Sag mir, ob du mehr Beispiele möchtest (z.B. ein Template für neue tRPC-Router oder eine `.env.example`).
