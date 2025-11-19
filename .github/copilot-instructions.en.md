# AI-Copilot Guide — English

Quick overview

- Architecture: SPA (Vite) in `client/` + Express + tRPC backend in `server/`. DB: Drizzle (`drizzle/`). Stripe routes under `server/routes/stripe`. Package manager: `pnpm`.

Key files to inspect first:

- `server/_core/index.ts` — server start, middleware order, Stripe webhook registration.
- `server/_core/vite.ts` — Vite dev middleware (HMR) integration.
- `server/routers.ts` — tRPC `appRouter` (exposed at `/api/trpc`).
- `server/routes/*` — REST endpoints (e.g. `checkout`, `stripe`).
- `drizzle/schema.ts` and `drizzle/migrations/` — DB schema + migrations.
- `shared/` — cross-cutting types and constants (`@shared/*`).

Essential commands

```sh
pnpm install
pnpm dev         # dev: tsx watches server/_core/index.ts + Vite HMR
pnpm run check   # tsc --noEmit
pnpm build       # client: vite build; server: esbuild bundle
pnpm start       # production: node dist/index.js
pnpm test        # vitest
pnpm run db:push # drizzle-kit generate && migrate
```

Critical, non-obvious rules (do not change)

- Stripe webhook: Register `/api/stripe/webhook` with `express.raw({ type: 'application/json' })` _before_ `express.json()` in `server/_core/index.ts`. Changing this breaks Stripe signature verification.
- API URL pattern: All API endpoints live under `/api/*`. tRPC is under `/api/trpc` — follow this when adding routes.
- Dev vs Prod: Dev uses Vite as middleware (`setupVite`). Production serves `dist/public` statics.
- Port logic: server prefers `process.env.PORT || 3000` and will search for an available port — tests/CI should account for this (`findAvailablePort`).
- Patched deps: see `patches/` and `pnpm.patchedDependencies` in `package.json`.

Short examples (copy-paste)

- Add a tRPC router: modify `server/routers.ts`:
  `router({ myFeature: router({ /* procedures */ }) })` → export via `appRouter` → client: `/api/trpc/myFeature`.
- Add a REST route: create `server/routes/<name>.ts` and mount in `server/_core/index.ts` with `app.use('/api/<name>', <route>)`.
- DB change: edit `drizzle/schema.ts` → run `pnpm run db:push` locally → commit generated files in `drizzle/migrations/`.

Helpful automation & tasks

- VS Code tasks available: `Start Project (start.sh)`, `Start Dev Server`, `Start Dev Server + Open`, `Open Live Preview (External)`, `Automation Assisten`.
- Automation Assisten: `bash ./scripts/assistant_automate.sh` or run the `Automation Assisten` task. It logs checkpoints to `tmp_debug/assistant_checkpoints.md`.

Debugging tips

- HMR stale pages → check `server/_core/vite.ts` that `vite.middlewares` are applied.
- Stripe webhook failures → confirm middleware order and webhook secret used in local test.
- Run `pnpm run check` before PRs; run `pnpm test` for unit tests.

PR checklist (important)

- Do not commit Stripe secrets or webhook signing keys. Use env vars and `.env.example` as template.
- Document breaking changes to `shared/` types and update consumers.
- Include migration files from `drizzle/migrations/` when DB schema changes.

If you need more

- I can scaffold: `.env.example`, `server/templates/trpc-router-template.ts`, or create a PR for `server/routes/stripe.ts`.
- See `README_AUTOMATION.md` for a user-focused walkthrough of automation, envs and webhook notes.

- End -
