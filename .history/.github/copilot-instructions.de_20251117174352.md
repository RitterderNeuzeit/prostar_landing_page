## AI-Copilot Anleitung (Deutsch, kompakt)

Kurzüberblick
- Architektur: SPA-Frontend mit Vite (`client/`) + Express-Server mit tRPC (`server/`). DB: Drizzle-ORM (`drizzle/`). Zahlungen: Stripe (`server/routes/stripe`). Paketmanager: `pnpm`.

Wesentliche Orte (schnell)
- Server-Start & Middleware: `server/_core/index.ts` (Port-Fallback, body-parser, Stripe-webhook-Setup).
- Vite Dev: `server/_core/vite.ts` (Vite-Middleware für Dev, HMR, Index-HTML-Transform).
- tRPC Router: `server/routers.ts` → exportiert `appRouter` unter `/api/trpc`.
- Routen: `server/routes/checkout`, `server/routes/stripe`.
- DB-Schema: `drizzle/schema.ts`; Migrationen: `drizzle/migrations/`.
- Shared-Types/Konstanten: `shared/` (Alias `@shared/*`).

Unverzichtbare Befehle
```
pnpm install
pnpm dev         # Development: tsx watch server/_core/index.ts + Vite-Middleware
pnpm run check   # TypeScript: tsc --noEmit
pnpm build       # Client: vite build; Server: esbuild Bundle
pnpm start       # Produktion: node dist/index.js
pnpm test        # Vitest
pnpm run db:push # drizzle-kit generate && drizzle-kit migrate
```

Wichtige Projekthinweise
- Stripe-Webhook: `server/_core/index.ts` registriert `/api/stripe/webhook` mit `express.raw({type: 'application/json'})` *vor* `express.json()` — **Reihenfolge nicht ändern**.
- API-Pattern: Alle API-Routen beginnen mit `/api/*`. tRPC-Endpunkte unter `/api/trpc`.
- Dev vs Prod: Dev nutzt Vite-Middleware; Prod dient statische Dateien aus `dist/public`.
- Build: `pnpm build` → `vite build` (Client) + `esbuild` (Server entry: `server/_core/index.ts`).
- Ports: Server versucht `process.env.PORT || 3000` und sucht einen freien Port (siehe `findAvailablePort`).
- Gepatchte Abhängigkeiten: `patches/` und `pnpm.patchedDependencies` in `package.json`.

Kurze Beispiele
- Neue tRPC-Route: `server/routers.ts` erweitern und in `appRouter` exportieren.
- Neue REST-Route: `server/routes/<name>.ts` erstellen und in `server/_core/index.ts` mounten.
- DB-Änderung: `drizzle/schema.ts` anpassen → `pnpm run db:push` → Migrationsdateien committen.

VS Code - Tasks & Vorschau
- Tasks vorhanden: `Start Project (start.sh)`, `Start Dev Server`, `Start Dev Server + Open`, `Open Live Preview (External)`.
- Skripte: `scripts/start.sh`, `scripts/start-dev-and-open.sh`, `scripts/open-dev-url.sh`.
- Empfehlung: Live Preview / Browser Preview Extension installieren; Task starten und die Preview auf der vom Server geöffneten URL laden.

Weitere Hilfe
- Sag mir, ob du eine ausführlichere `.env.example`, ein tRPC-Template mit DB-Beispielen, oder eine PR-Vorlage möchtest.
