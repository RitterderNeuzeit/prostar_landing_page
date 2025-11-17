## Kurzanleitung für AI-Copiloten (kurz & auf Deutsch)

Kurz: Vite-Client (`client/`) + Express/tRPC-Server (`server/`), Drizzle-ORM für die DB, Stripe-Integration. Verwende `pnpm`.

Wichtige Orte (schnell):
- Server-Start & Middleware: `server/_core/index.ts`, `server/_core/vite.ts`
- API: `server/routes/`, `server/routers.ts`, `server/_core/trpc.ts`
- DB-Schema: `drizzle/schema.ts`, `drizzle/migrations/`
- Shared-Typen/Konstanten: `shared/` (Pfad-Alias `@shared/*`)

Unverzichtbare Befehle:
```
pnpm install
pnpm dev       # Dev: server + Vite
pnpm run check # tsc --noEmit
pnpm build
pnpm start
pnpm test
pnpm run db:push
```

Kurz-Gotchas:
- Stripe-Webhook braucht rohen Body: Route wird vor `express.json()` registriert (`/api/stripe/webhook`).
- Dev-Server sucht freien Port (Start bei `PORT` oder 3000).
- `pnpm`-Patches liegen in `patches/` (siehe `package.json`).

Projekt-Konventionen:
- Alle APIs unter `/api/*`.
- tRPC-Router werden an `appRouter` gehängt; nutze `publicProcedure`/`protectedProcedure`.
- Pfad-Alias: `@/*` → `client/src/*`, `@shared/*` → `shared/*`.

Kurze PR-Checkliste (immer):
- `@shared`-Typen unverändert lassen wenn möglich.
- Bei DB-Änderungen: `pnpm run db:push` lokal ausführen und Migrationsdateien mitschicken.
- Lokaler Prod-Check: `pnpm build && pnpm start`.

Weitere Optionen: `.env.example` anlegen oder zweisprachige Fassung. Möchtest du `.env.example` (ja/nein)?
