````instructions
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
- Stripe webhook: `server/_core/index.ts` registers `/api/stripe/webhook` with `express.raw({type: 'application/json'})` *before* `express.json()` — **do not change this order**.
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
  - `scripts/assistant_automate.sh` (Automation assisten — interactive automation with 10s timeout)
- Recommendation: install the **Live Preview** (Microsoft) or **Browser Preview** extension in VS Code; start a task and open the preview on the server URL.

Automation assisten
- **Purpose**: lightweight runner that asks for a semicolon-separated list of tasks, waits 10s for input, and otherwise runs a sensible default sequence. It logs structured checkpoints to `tmp_debug/assistant_checkpoints.md`.
- **Run**: from the workspace run the VS Code task `Automation Assisten` or execute `bash ./scripts/assistant_automate.sh`.
 - **Run**: from the workspace run the VS Code task `Automation Assisten` or execute `node ./scripts/assistant_automate.js`.
- **Notes**: long-running `dev` commands are started in background so the assistant can continue with subsequent tasks. Checkpoints include timestamps, task, status and a short output excerpt.

Short & practical
- `.env.example`: example variables (copy to `.env` before local start).
- `server/templates/trpc-router-template.ts`: example template for new tRPC routers.

Feedback
- Tell me if you want a bilingual `.github/copilot-instructions.md` kept, a standalone English file, or additional examples (e.g. DB-backed tRPC example).

````
