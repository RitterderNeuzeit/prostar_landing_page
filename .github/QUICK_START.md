# Quick Start — Schnelleinstieg (1 Seite)

**Für:** Neue Entwickler, AI-Agenten, PR-Reviewer  
**Zeit:** 5 Minuten zum Setup

---

## 🚀 Los geht's (5 Min)

```bash
# 1. Projekt klonen & Abhängigkeiten installieren
git clone https://github.com/AIHubcom/prostar_landing_page--1-.git
cd prostar_landing_page*
pnpm install

# 2. Umgebungsvariablen kopieren & anpassen
cp .env.example .env
# Öffne .env und setze:
# - DATABASE_URL=... (MySQL)
# - STRIPE_SECRET=... (Stripe Test Key)

# 3. Dev-Server starten
pnpm dev
# → Öffne http://localhost:3000 im Browser
```

---

## 📁 Projekstruktur (Wichtigste Orte)

```
client/               ← Vite React SPA (Browser-Frontend)
  src/               ← Components, Pages, Hooks
server/              ← Express + tRPC Backend
  _core/index.ts     ← KRITISCH: Middleware-Reihenfolge, Stripe-Setup
  routers.ts         ← tRPC-Endpunkte (/api/trpc)
  routes/            ← REST-Endpunkte (/api/*)
drizzle/
  schema.ts          ← Datenbank-Schema
  migrations/        ← Auto-generiert nach pnpm run db:push
shared/              ← Gemeinsame Typen (@shared/*)
.github/copilot-instructions.md  ← Detaillierte AI-Anleitung
```

---

## 🔥 Top 5 Befehle

| Befehl             | Was macht's         | Wann nutzen          |
| ------------------ | ------------------- | -------------------- |
| `pnpm dev`         | Dev-Server + HMR    | Development, täglich |
| `pnpm run check`   | TypeScript-Check    | Vor jedem Commit     |
| `pnpm test`        | Unit-Tests (Vitest) | Vor PR               |
| `pnpm build`       | Production-Build    | Vor Deployment       |
| `pnpm run db:push` | DB-Schema-Migration | Nach Schema-Änderung |

---

## ⚙️ Häufigste Aufgaben

### Feature hinzufügen (tRPC-API)

```ts
// 1. Datei: server/routers.ts
export const appRouter = router({
  myFeature: router({
    getData: publicProcedure.query(async () => {
      return { message: 'Hallo!' };
    }),
  }),
});

// 2. Terminal
pnpm dev

// 3. Client: client/src/pages/MyPage.tsx
import { trpc } from '@/utils/trpc';
const { data } = trpc.myFeature.getData.useQuery();
```

### REST-Endpoint hinzufügen

```ts
// 1. Neue Datei: server/routes/webhook.ts
import express from 'express';
export const webhookRoute = express.Router();
webhookRoute.post('/', (req, res) => {
  res.json({ received: true });
});

// 2. Datei: server/_core/index.ts
// OBEN (vor express.json()):
app.use('/api/webhook', webhookRoute);

// 3. Testen
curl -X POST http://localhost:3000/api/webhook
```

### Datenbank-Schema ändern

```ts
// 1. Datei: drizzle/schema.ts (neue Tabelle)
export const products = mysqlTable('products', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  price: decimal('10,2').notNull(),
});

// 2. Terminal
pnpm run db:push

// 3. Migration wird auto-generiert → drizzle/migrations/
// Datei committen!
git add drizzle/migrations/
git commit -m "Add products table"
```

---

## 🐛 Häufigste Fehler & Fixes

| Fehler                       | Ursache                  | Fix                                                                                  |
| ---------------------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| "Cannot find module @shared" | Path-Alias nicht richtig | `tsconfig.json` → `"@shared/*": ["shared/*"]`                                        |
| Stripe Webhook bricht        | Middleware-Reihenfolge   | `express.raw()` MUSS vor `express.json()` sein (siehe `server/_core/index.ts`)       |
| HMR lädt nicht neu           | Vite Middleware fehlt    | Check `server/_core/vite.ts` → `app.use(vite.middlewares)` muss richtig applied sein |
| Port 3000 belegt             | Anderer Service nutzt es | Server fallback auf nächsten Port (3001, 3002, ...)                                  |
| Typen nicht aktualisiert     | TypeScript-Cache         | `pnpm run check` oder `tsc --noEmit`                                                 |

---

## ✅ PR-Checklist (vor Submit)

```bash
pnpm run check            # ✅ TypeScript OK?
pnpm run format:check     # ✅ Prettier OK?
pnpm duplication:check    # ✅ Keine Duplikate?
pnpm test                 # ✅ Tests grün?
pnpm build && pnpm start  # ✅ Production-Build OK?
```

**Zusätzlich:**

- ✅ `.env` nicht committet?
- ✅ Stripe-Secrets nicht in Code hardcodiert?
- ✅ DB-Migrations bei Schema-Änderungen committet?
- ✅ PR-Beschreibung kurz & klar?

---

## 🎯 Nächste Schritte

- **Detaillierte Anleitung:** `.github/copilot-instructions.md` 📖
- **Sprachrichtlinie:** `.github/LANGUAGE_POLICY.md` 🌐
- **Automation:** `docs/README_AUTOMATION.md` 🤖
- **Stripe-Setup:** `docs/STRIPE_INTEGRATION_GUIDE.md` 💳

---

## 💬 Fragen?

- Siehe `.github/copilot-instructions.md` (Debugging-Sektion)
- Oder öffne ein Issue mit Tag `help-wanted`

**Happy Coding! 🚀**
