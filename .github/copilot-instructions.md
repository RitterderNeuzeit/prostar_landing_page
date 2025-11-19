## AI-Copilot Guide (English, concise)

Quick overview

- Architecture: SPA frontend with Vite (`client/`) and an Express + tRPC backend (`server/`). DB: Drizzle-ORM (`drizzle/`). Payments: Stripe (`server/routes/stripe`). Package manager: `pnpm`.

Key locations (quick)

- Server start & middleware: `server/_core/index.ts` (port fallback, body-parser, Stripe webhook setup).
- Vite Dev integration: `server/_core/vite.ts` (Vite middleware for dev with HMR).
- tRPC router: `server/routers.ts` → exports `appRouter` at `/api/trpc`.
- Routes: `server/routes/checkout`, `server/routes/stripe`.
- DB schema: `drizzle/schema.ts`; migrations in `drizzle/migrations/`.
- Shared types/constants: `shared/` (path alias `@shared/*`).

Essential commands

```
pnpm install
pnpm dev         # development: tsx watch server/_core/index.ts + Vite middleware
pnpm run check   # TypeScript: tsc --noEmit
pnpm build       # client: vite build; server: esbuild bundle (see package.json)
pnpm start       # production start: node dist/index.js
pnpm test        # runs vitest
pnpm run db:push # drizzle-kit generate && drizzle-kit migrate
```

Repo-specific gotchas & rules

- Stripe webhook: `server/_core/index.ts` registers `/api/stripe/webhook` with `express.raw({type: 'application/json'})` _before_ `express.json()` — **do not change this order**.
- API pattern: All API routes start with `/api/*` (important for gateways). tRPC endpoints live under `/api/trpc`.
- Dev vs Prod: Dev uses Vite middleware (`setupVite`) with HMR; Prod serves static files from `dist/public` (`serveStatic`).
- Build: `pnpm build` runs `vite build` for the client and then bundles the server with `esbuild` (entry: `server/_core/index.ts`).
- Ports: The server attempts `process.env.PORT || 3000` and will search for a free port (see `findAvailablePort`). Keep this in mind for tests/CI.
- Patches: Patched dependencies live in `patches/` (see `pnpm.patchedDependencies` in `package.json`).

## AI-Copilot Guide (English, concise)

Quick overview

- Architecture: SPA frontend with Vite (`client/`) and an Express + tRPC backend (`server/`). DB: Drizzle-ORM (`drizzle/`). Payments: Stripe (`server/routes/stripe`). Package manager: `pnpm`.

Key locations (quick)

- Server start & middleware: `server/_core/index.ts` (port fallback, body-parser, Stripe webhook setup).
- Vite Dev integration: `server/_core/vite.ts` (Vite middleware for dev with HMR).
- tRPC router: `server/routers.ts` → exports `appRouter` at `/api/trpc`.
- Routes: `server/routes/checkout`, `server/routes/stripe`.
- DB schema: `drizzle/schema.ts`; migrations in `drizzle/migrations/`.
- Shared types/constants: `shared/` (path alias `@shared/*`).

Essential commands

```
pnpm install
pnpm dev         # development: tsx watch server/_core/index.ts + Vite middleware
pnpm run check   # TypeScript: tsc --noEmit
pnpm build       # client: vite build; server: esbuild bundle (see package.json)
pnpm start       # production start: node dist/index.js
pnpm test        # runs vitest
pnpm run db:push # drizzle-kit generate && drizzle-kit migrate
```

Repo-specific gotchas & rules

- Stripe webhook: `server/_core/index.ts` registers `/api/stripe/webhook` with `express.raw({type: 'application/json'})` _before_ `express.json()` — **do not change this order**.
- API pattern: All API routes start with `/api/*` (important for gateways). tRPC endpoints live under `/api/trpc`.
- Dev vs Prod: Dev uses Vite middleware (`setupVite`) with HMR; Prod serves static files from `dist/public` (`serveStatic`).
- Build: `pnpm build` runs `vite build` for the client and then bundles the server with `esbuild` (entry: `server/_core/index.ts`).
- Ports: The server attempts `process.env.PORT || 3000` and will search for a free port (see `findAvailablePort`). Keep this in mind for tests/CI.
- Patches: Patched dependencies live in `patches/` (see `pnpm.patchedDependencies` in `package.json`).

Concrete examples (copy-paste)

- Add a tRPC router: add `router({ myFeature: router({ ... }) })` in `server/routers.ts` and export it on `appRouter`.
- Add a REST route: create `server/routes/<name>.ts` and mount it in `server/_core/index.ts` via `app.use('/api/<name>', <route>)`.
- DB change: update `drizzle/schema.ts` → run `pnpm run db:push` → commit `drizzle/migrations/`.

Debugging / testing notes

- For HMR issues, check `server/_core/vite.ts` and verify `vite.middlewares` is applied and that `index.html` is reloaded.
- TypeScript: run `pnpm run check` before PRs; tests: `pnpm test`.

PR checklist (practical)

- Avoid changing `@shared` types unless necessary; document breaking changes.
- For DB changes: run `pnpm run db:push` locally and include migration files in the PR.
- Stripe: never commit secrets or webhook signing keys; keep webhook middleware order intact.

If you want

- I can scaffold templates: `.env.example`, a tRPC router template, or prepare a PR for `server/routes/stripe.ts`. Tell me which.

VS Code: Tasks & Preview (practical)

- Available VS Code tasks:
  - `Start Project (start.sh)` — runs `./scripts/start.sh` (installs and starts pnpm or uses Docker fallback).
  - `Start Dev Server` — runs `pnpm dev` (HMR via Vite).
  - `Start Dev Server + Open` — starts the dev server (if needed) and opens the URL detected by the script (checks ports `3000`–`3020`).
  - `Open Live Preview (External)` — opens the first reachable dev URL or `http://localhost:3000`.
- Helpful scripts:
  - `scripts/start.sh` (universal start script)
  - `scripts/start-dev-and-open.sh` (starts pnpm dev and opens the detected port URL)
  - `scripts/open-dev-url.sh` (opens running dev server)
- Recommendation: install the **Live Preview** (Microsoft) or **Browser Preview** extension in VS Code; start a task and open the preview on the server URL.

Short & practical

- `.env.example`: example variables (copy to `.env` before local start).
- `server/templates/trpc-router-template.ts`: example template for new tRPC routers.

Feedback

- Tell me if you want a bilingual `.github/copilot-instructions.md` kept, a standalone English file, or additional examples (e.g. DB-backed tRPC example).

````
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

VS Code: Vorschau ohne externen Browser
- Empfehlung: installiere die Erweiterung **Live Preview** (Microsoft) oder **Browser Preview**. Beide zeigen eine Webseite direkt in VS Code.
- Ablauf: `Terminal -> Run Task -> Start Dev Server` (führt `pnpm dev` aus) → Extension öffnen (`Live Preview: Show Preview`) → `http://localhost:3000` eingeben.
- Es gibt ein Arbeitsbereich-Task `Open Live Preview (External)`, das `open http://localhost:3000` ausführt, falls du extern testen willst.
- Hinweis: Die Dev-Server-Logik verwendet Vite-Middleware; stelle sicher, dass `pnpm dev` läuft bevor du die Vorschau öffnest.
# AI-Copilot Anleitung — Deutsch

Kurzübersicht
- Architektur: SPA-Frontend (`client/` mit Vite) + Express-Server mit tRPC (`server/`). DB: Drizzle (`drizzle/`). Stripe-Routen unter `server/routes/stripe`. Paketmanager: `pnpm`.

Wichtige Dateien
- `server/_core/index.ts` — Serverstart, Middleware-Reihenfolge, Stripe-Webhooks.
- `server/_core/vite.ts` — Vite Dev-Middleware (HMR) in Dev-Mode.
- `server/routers.ts` — tRPC `appRouter` (exposed unter `/api/trpc`).
- `server/routes/*` — REST-Routen (z.B. `checkout`, `stripe`).
- `drizzle/schema.ts` & `drizzle/migrations/` — DB-Schema & Migrationen.
- `shared/` — gemeinsame Typen/Konstanten (`@shared/*`).

Wesentliche Befehle
```sh
pnpm install
pnpm dev         # Dev: startet Server (tsx watch) + Vite HMR
pnpm run check   # TypeScript: tsc --noEmit
pnpm build       # Client: vite build; Server: esbuild bundle
pnpm start       # Produktion: node dist/index.js
pnpm test        # vitest
pnpm run db:push # drizzle-kit generate && migrate
```

Repo-spezifische Regeln (wichtig)
- Stripe Webhook: Registriere `/api/stripe/webhook` mit `express.raw({ type: 'application/json' })` *vor* `express.json()` in `server/_core/index.ts`. Änderung bricht Signaturprüfung.
- API-Pattern: Alle APIs unter `/api/*`. tRPC unter `/api/trpc`.
- Dev vs Prod: Dev verwendet Vite-Middleware (`setupVite`); Prod serviert statische Dateien aus `dist/public`.
- Port-Logik: Server nutzt `PORT || 3000` und versucht ggf. freie Ports (`findAvailablePort`). Tests/CI beachten.
- Gepatchte Abhängigkeiten: `patches/` und `pnpm.patchedDependencies` in `package.json`.

Copy-Paste Beispiele
- tRPC-Router hinzufügen: in `server/routers.ts`:
  `router({ myFeature: router({ /* procedures */ }) })` → in `appRouter` exportieren → Client: `/api/trpc/myFeature`.
- REST-Route hinzufügen: `server/routes/<name>.ts` erstellen und in `server/_core/index.ts` mounten: `app.use('/api/<name>', <route>)`.
- DB-Änderung: `drizzle/schema.ts` anpassen → `pnpm run db:push` → `drizzle/migrations/` committen.

Automation & VS Code Tasks
- Tasks: `Start Project (start.sh)`, `Start Dev Server`, `Start Dev Server + Open`, `Open Live Preview (External)`, `Automation Assisten`.
- Automation Assisten: `bash ./scripts/assistant_automate.sh` oder VS Code Task `Automation Assisten`; Log: `tmp_debug/assistant_checkpoints.md`.

Debugging Tipps
- HMR: Prüfe `server/_core/vite.ts` auf richtige Anwendung von `vite.middlewares`.
- Stripe Webhook Fehler: Prüfe Middleware-Reihenfolge und Webhook-Secret (env).
- Vor PR: `pnpm run check`; Unit-Tests: `pnpm test`.

PR-Checklist
- Stripe-Secrets nicht committen; `.env.example` als Vorlage nutzen.
- Breaking-Changes an `shared/`-Typen dokumentieren und Konsumenten anpassen.
- Migrationen aus `drizzle/migrations/` bei DB-Änderungen mitschicken.

Weiteres
- `README_AUTOMATION.md` enthält eine ausführlichere Anleitung zur Automation, Umgebungsvariablen und Webhook-Hinweise.

- Ende -
  - I can scaffold: `.env.example`, `server/templates/trpc-router-template.ts`, or create a PR for `server/routes/stripe.ts`.
````
