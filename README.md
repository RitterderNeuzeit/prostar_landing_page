# ProStar Landing Page

**Version:** 1.0.0 - Master Checkpoint 🎯  
**Status:** ✅ PRODUCTION READY - STABLE BASE  
**Branch:** `master-checkpoint-v1.0.0`  
**Tag:** `v1.0.0`  
**Datum:** 7. Dezember 2025

> **FINAL Release:** Alle Features getestet, dokumentiert und synchronisiert.  
> Breaking Changes erfordern neue Checkpoint-Version.

---

## 🚀 Schnellstart

```sh
# 1. Dependencies installieren
pnpm install

# 2. Environment konfigurieren
cp .env.example .env
# -> .env mit echten Werten bearbeiten

# 3. Datenbank vorbereiten
pnpm run db:push

# 4. Dev-Server starten
pnpm dev
# -> Öffne http://localhost:3000
```

## Struktur

- `client/` – Frontend (Vite + React + Tailwind)
- `server/` – Backend (Express.js + tRPC + TypeScript)
- `drizzle/` – Datenbank (Drizzle ORM + MySQL)
- `shared/` – Gemeinsame Typen/Konstanten
- `docs/` – Dokumentation & Guides

## 📦 Wichtige Befehle

### Development
- `pnpm dev` – Dev-Server mit HMR (Hot Module Reload)
- `pnpm run check` – TypeScript Type-Check (ohne emit)
- `pnpm test` – Unit-Tests ausführen (Vitest)

### Build & Deployment
- `pnpm run build` – Production Build (Vite + ESBuild)
- `pnpm start` – Production Server starten
- `pnpm run clean` – Build-Artefakte löschen

### Code Quality
- `pnpm run format` – Code formatieren (Prettier)
- `pnpm run format:check` – Format prüfen (CI)
- `pnpm run lint` – Linting durchführen

### Datenbank
- `pnpm run db:generate` – Drizzle Migrations generieren
- `pnpm run db:migrate` – Migrations anwenden
- `pnpm run db:push` – Generate + Migrate (Shortcut)
- `pnpm run db:studio` – Drizzle Studio öffnen

## Automatisierte Checks

Siehe `docs/AUTOMATISIERTE_CHECKS.md` für Details zu Formatierung, Linting und Tests.

## 📚 Dokumentation

### Kern-Dokumente
- **[MASTER_CHECKPOINT.md](./MASTER_CHECKPOINT.md)** – Vollständige Checkpoint-Dokumentation
- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** – AI-Copilot Anleitung

### Guides
- **Stripe-Integration:** `docs/STRIPE_INTEGRATION_GUIDE.md`
- **Deployment & Automation:** `docs/README_AUTOMATION.md`
- **Tests & Checks:** `docs/AUTOMATISIERTE_CHECKS.md`

## 🎯 Features (LOCKED)

✅ **Landing Page** – Hero, Case Studies, Testimonials, Trust-Section  
✅ **Kurs-System** – 6 Module mit Markdown-Content, Progress-Tracking  
✅ **Registrierung** – Email-Verifizierung mit Access-Keys  
✅ **Email-Automation** – SMTP via Gmail, Open-Tracking, Retry-Logic  
✅ **Payment** – Stripe Integration (3 Pricing-Tiers)  
✅ **Datenbank** – MySQL 8.0 mit Drizzle ORM  
✅ **API** – tRPC + REST Endpoints  

## 🏗️ Tech Stack

```
Frontend:  Vite + React + Tailwind CSS + shadcn/ui
Backend:   Express.js + tRPC + TypeScript  
Database:  MySQL 8.0 + Drizzle ORM
Email:     Nodemailer (Gmail SMTP)
Payment:   Stripe API
```

---

**Letztes Update:** 2025-12-07  
**Checkpoint-Hash:** `1d8d638`

## Automatisierte E2E-Tests & E-Mail-Flow

- End-to-End-Test: `npx tsx scripts/e2e-customer-flow.ts --email info.loco@gmx.de --name "Auto Tester"`
- CI: E2E-Job ist durch Secrets und Feature-Flag geschützt (`ALLOW_E2E_EMAILS`)
- Format- und Type-Checks: `pnpm run format:check`, `pnpm run check`
- Datenbank: MySQL-Container via Docker, Migrationen mit `pnpm run db:push`
- Dev-Server: `pnpm dev` (Port wird automatisch gewählt)
- Cleanup: `.history`-YAMLs entfernt, Format-Check läuft

Letzter Test: Zugangscode `infoloco_7262c310dfee4511bc61`, E-Mail versendet, Kurszugang erfolgreich.
