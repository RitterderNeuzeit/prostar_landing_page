## AI-Copilot Anleitung (Deutsch, kompakt)

Kurzüberblick
- Architektur: SPA-Frontend mit Vite (`client/`) + Express-Server mit tRPC (`server/`). DB: Drizzle-ORM (`drizzle/`). Zahlungen: Stripe (`server/routes/stripe`). Paketmanager: `pnpm`.

Wesentliche Orte (schnell)
- Server-Start & Middleware: `server/_core/index.ts` (Port-Fallback, body-parser, Stripe-webhook-setup).
- Vite Dev: `server/_core/vite.ts` (integriert Vite als middleware in Dev).
- tRPC Router: `server/routers.ts` → exportiert `appRouter` unter `/api/trpc`.
- Routen: `server/routes/checkout`, `server/routes/stripe`.
- DB-Schema: `drizzle/schema.ts`; Migrationen: `drizzle/migrations/`.
- Shared-Types: `shared/` (Alias `@shared/*`).

Unverzichtbare Befehle
```
pnpm install
pnpm dev         # dev: startet server (tsx watch server/_core/index.ts) + Vite middleware
pnpm run check   # tsc --noEmit
pnpm build       # client: vite build; server: esbuild bundle (siehe package.json)
pnpm start       # startet gebundeltes server: node dist/index.js
pnpm test        # vitest
pnpm run db:push # drizzle-kit generate && drizzle-kit migrate
```

Repo-spezifische Gotchas & Regeln
- Stripe webhook: `server/_core/index.ts` registriert `/api/stripe/webhook` mit `express.raw({type: 'application/json'})` *vor* `express.json()` — **die Reihenfolge darf nicht geändert werden**.
- API-Pattern: Alle API-Routen beginnen mit `/api/*` (wichtig für Gateways). tRPC-Endpoints leben unter `/api/trpc`.
- Dev vs Prod: Dev verwendet Vite middleware (HMR) via `setupVite`; Prod dient statische Dateien aus `dist/public` (`serveStatic`).
- Build: `pnpm build` führt `vite build` für `client/` aus und bundelt anschließend den Server mit `esbuild` (Entry: `server/_core/index.ts`).
- Ports: Server sucht einen freien Port ab `process.env.PORT || 3000` (siehe `findAvailablePort`). Tests/CI sollten das berücksichtigen.
- Patches: Gepatchte Pakete liegen in `patches/` (siehe `package.json` `pnpm.patchedDependencies`).

Konkrete Beispiele (Copy-paste tauglich)
- Neue tRPC-Route: füge in `server/routers.ts` ein `router({ myFeature: router({ ... }) })` und exportiere es in `appRouter`.
- Neue REST-Route: erstelle `server/routes/<name>.ts` und mount in `server/_core/index.ts` via `app.use('/api/<name>', <route>)`.
- DB-Änderung: anpassen `drizzle/schema.ts` → `pnpm run db:push` → commit `drizzle/migrations/`.

Debugging / Testing Hinweise
- HMR-Probleme prüfen: `server/_core/vite.ts` verwendet `vite.middlewares` und lädt `client/index.html` neu.
- TypeScript: `pnpm run check` vor Commits; Tests mit `pnpm test`.

PR-Checklist (praktisch)
- Ändere `@shared`-Typen nur wenn nötig; bei Breaking-Changes dokumentieren.
- Bei DB-Änderungen: lokal `pnpm run db:push` ausführen und Migrationsdateien mitschicken.
- Stripe: Secrets oder Webhook-Signing-Keys niemals ins Repo committen; Webhook-Routing-Reihenfolge erhalten.

Wenn du möchtest
- Ich kann Vorlagen erzeugen: `.env.example`, tRPC-Router-Template, oder eine PR mit `server/routes/stripe.ts` Änderungen vorschlagen. Sag mir welche Datei du willst.
## AI-Copilot Anleitung (Deutsch, kompakt)

Kurzüberblick
- Architektur: SPA-Frontend mit Vite (`client/`) + Express-Server mit tRPC (`server/`). DB: Drizzle-ORM (`drizzle/`). Zahlungen: Stripe (`server/routes/stripe`). Paketmanager: `pnpm`.

Schnelle Referenzen (wichtig)
- Server-Start & Middleware: `server/_core/index.ts` (Port-Fallback, body-parser, Stripe-webhook-setup).
- Vite Dev: `server/_core/vite.ts` (integriert Vite als middleware in Dev).
- tRPC Router: `server/routers.ts` → exportiert `appRouter` unter `/api/trpc`.
- Routen: `server/routes/checkout`, `server/routes/stripe`.
- DB-Schema: `drizzle/schema.ts`; Migrationen: `drizzle/migrations/`.
- Shared-Types: `shared/` (Alias `@shared/*`).

Unverzichtbare Befehle
```
pnpm install
pnpm dev         # dev: startet server (tsx watch server/_core/index.ts) + Vite middleware
pnpm run check   # tsc --noEmit
pnpm build       # client: vite build; server: esbuild bundle (siehe package.json)
pnpm start       # startet gebundeltes server: node dist/index.js
pnpm test        # vitest
pnpm run db:push # drizzle-kit generate && drizzle-kit migrate
```

Repo-spezifische Gotchas & Regeln
- Stripe webhook: `server/_core/index.ts` registriert `/api/stripe/webhook` mit `express.raw({type: 'application/json'})` *vor* `express.json()` — **die Reihenfolge darf nicht geändert werden**.
- API-Pattern: Alle API-Routen beginnen mit `/api/*` (wichtig für Gateways). tRPC-Endpoints leben unter `/api/trpc`.
- Dev vs Prod: Dev verwendet Vite middleware (HMR) via `setupVite`; Prod dient statische Dateien aus `dist/public` (`serveStatic`).
- Build: `pnpm build` führt `vite build` für `client/` aus und bundelt anschließend den Server mit `esbuild` (Entry: `server/_core/index.ts`).
- Ports: Server sucht einen freien Port ab `process.env.PORT || 3000` (siehe `findAvailablePort`). Tests/CI sollten das berücksichtigen.
- Patches: Gepatchte Pakete liegen in `patches/` (siehe `package.json` `pnpm.patchedDependencies`).

Konkrete Beispiele (Copy-paste tauglich)
- Neue tRPC-Route: füge in `server/routers.ts` ein `router({ myFeature: router({ ... }) })` und exportiere es in `appRouter`.
- Neue REST-Route: erstelle `server/routes/<name>.ts` und mount in `server/_core/index.ts` via `app.use('/api/<name>', <route>)`.
- DB-Änderung: anpassen `drizzle/schema.ts` → `pnpm run db:push` → commit `drizzle/migrations/`.

Debugging / Testing Hinweise
- HMR-Probleme prüfen: `server/_core/vite.ts` verwendet `vite.middlewares` und lädt `client/index.html` neu.
- TypeScript: `pnpm run check` vor Commits; Tests mit `pnpm test`.

PR-Checklist (praktisch)
- Ändere `@shared`-Typen nur wenn nötig; bei Breaking-Changes dokumentieren.
- Bei DB-Änderungen: lokal `pnpm run db:push` ausführen und Migrationsdateien mitsenden.
- Stripe: Secrets oder Webhook-Signing-Keys niemals ins Repo committen; Webhook-Routing-Reihenfolge erhalten.

Wenn du möchtest
- Ich kann Vorlagen erzeugen: `.env.example`, tRPC-Router-Template, oder eine PR mit `server/routes/stripe.ts` Änderungen vorschlagen. Sag mir welche Datei du willst.
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
