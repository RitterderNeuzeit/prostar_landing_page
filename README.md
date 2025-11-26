# ProStar Landing Page – Projektstruktur & Nutzung

## Schnellstart

```sh
pnpm install
pnpm dev
# Öffne http://localhost:3000
```

## Struktur

- `client/` – Frontend (Vite + React + Tailwind)
- `server/` – Backend (Express.js + tRPC + TypeScript)
- `drizzle/` – Datenbank (Drizzle ORM + MySQL)
- `shared/` – Gemeinsame Typen/Konstanten
- `docs/` – Dokumentation & Guides

## Wichtige Befehle

- `pnpm dev` – Dev-Server mit HMR
- `pnpm test` – Tests ausführen (Vitest)
- `pnpm run format:check` – Prettier-Check
- `pnpm run lint` – ESLint-Check
- `pnpm duplication:check` – Duplikate prüfen

## Automatisierte Checks

Siehe `docs/AUTOMATISIERTE_CHECKS.md` für Details zu Formatierung, Linting und Tests.

## Weitere Infos

- Stripe-Integration: `docs/STRIPE_INTEGRATION_GUIDE.md`
- Deployment: `docs/README_AUTOMATION.md`
- Fehlerbehebung: `docs/AUTOMATISIERTE_CHECKS.md`

---

**Stand:** 20.11.2025

## Automatisierte E2E-Tests & E-Mail-Flow

- End-to-End-Test: `npx tsx scripts/e2e-customer-flow.ts --email info.loco@gmx.de --name "Auto Tester"`
- CI: E2E-Job ist durch Secrets und Feature-Flag geschützt (`ALLOW_E2E_EMAILS`)
- Format- und Type-Checks: `pnpm run format:check`, `pnpm run check`
- Datenbank: MySQL-Container via Docker, Migrationen mit `pnpm run db:push`
- Dev-Server: `pnpm dev` (Port wird automatisch gewählt)
- Cleanup: `.history`-YAMLs entfernt, Format-Check läuft

Letzter Test: Zugangscode `infoloco_7262c310dfee4511bc61`, E-Mail versendet, Kurszugang erfolgreich.
