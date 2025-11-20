# AI-Copilot Anleitung — Deutsch

**Version:** 1.1.0 | **Aktualisiert:** 19.11.2025 | **Sprache:** Deutsch | **Zielgruppe:** Entwickler & AI-Agenten

## 📑 Inhaltsverzeichnis

1. Executive Summary
2. Kurzübersicht
3. Projekt-Struktur
4. Essenzielle Befehle
5. Kritische Regeln
6. Copy-Paste Beispiele
7. Debugging & Testing
8. PR/Commit-Prozess
9. VS Code Automatisierung
10. Schnell-Referenzen
11. Weitere Informationen

---

## 0. Executive Summary

**Für eilige Entwickler (3 Minuten):**

Diese Anleitung richtet sich an **Entwickler und AI-Agenten**, die am ProStar-Landing-Page-Projekt arbeiten. Das Projekt verwendet:

- **Frontend:** Vite + React + Tailwind CSS (aus `client/`)
- **Backend:** Express.js + tRPC + TypeScript (aus `server/`)
- **Datenbank:** Drizzle-ORM mit MySQL (aus `drizzle/`)
- **Paketmanager:** pnpm 10.15+

**Schnell-Start (90 Sekunden):**

```bash
pnpm install          # Abhängigkeiten
pnpm dev              # Dev-Server starten (HMR aktiv)
# Öffne http://localhost:3000
```

**⚠️ Achtung:** Stripe-Webhook-Middleware ist KRITISCH geordnet (siehe Abschnitt 4.1).

---

## 1. Kurzübersicht

- **Architektur:** SPA-Frontend mit Vite (`client/`) + Express-Server mit tRPC (`server/`)
- **Datenbank:** Drizzle-ORM (`drizzle/`)
- **Zahlungen:** Stripe (`server/routes/stripe`)
- **Paketmanager:** `pnpm`

## 2. Projekt-Struktur

### 2.1 Wichtige Dateien & Orte

| Datei                   | Zweck                                                            |
| ----------------------- | ---------------------------------------------------------------- |
| `server/_core/index.ts` | Serverstart, Middleware-Reihenfolge (kritisch!), Stripe-Webhooks |
| `server/_core/vite.ts`  | Vite Dev-Middleware mit HMR für Hot Reload                       |
| `server/routers.ts`     | Zentrale tRPC-Router (exposed unter `/api/trpc`)                 |
| `server/routes/*`       | REST-Endpunkte (z.B. `checkout`, `stripe`)                       |
| `drizzle/schema.ts`     | Datenbank-Schema                                                 |
| `drizzle/migrations/`   | Migrations-Historien (nach `pnpm run db:push` generiert)         |
| `shared/`               | Gemeinsame Typen/Konstanten (Alias: `@shared/*`)                 |

## Essenzielle Befehle

\`\`\`sh
pnpm install # Abhängigkeiten installieren
pnpm dev # Dev-Server: tsx watch + Vite HMR
pnpm run check # TypeScript ohne emit
pnpm build # Client: vite build; Server: esbuild bundle
pnpm start # Produktion: node dist/index.js
pnpm test # Vitest ausführen
pnpm run db:push # drizzle-kit generate && migrate
pnpm run format:check # Prettier-Check
pnpm duplication:check # jscpd (Duplikate prüfen)
\`\`\`

## Repo-spezifische Regeln (KRITISCH)

### 🚨 Stripe-Webhook Middleware-Reihenfolge

\`\`\`ts
// RICHTIG: express.raw() MUSS vor express.json() registriert sein!
app.use('/api/stripe/webhook', express.raw({type: 'application/json'}), stripeWebhookRoute);
app.use(express.json());

// FALSCH: würde Signaturprüfung brechen!
app.use(express.json());
app.use('/api/stripe/webhook', ...);
\`\`\`

### API-Pattern

- Alle APIs starten mit `/api/*` (wichtig für Gateways/Proxies)
- tRPC-Endpunkte: `/api/trpc`

### Dev vs. Produktion

| Modus    | Middleware              | Dateien                       |
| -------- | ----------------------- | ----------------------------- |
| **Dev**  | \`setupVite()\` mit HMR | Live aus \`client/src/\`      |
| **Prod** | \`serveStatic()\`       | Gebündelt in \`dist/public/\` |

### Port-Logik

- Server nutzt \`PORT || 3000\` (Fallback auf 3000)
- Versucht automatisch freie Ports via \`findAvailablePort()\` (Tests/CI beachten!)

### Gepatchte Abhängigkeiten

- Liegen in \`patches/\`
- Registriert in \`pnpm.patchedDependencies\` (\`package.json\`)

## Copy-Paste Beispiele

### tRPC-Router hinzufügen

\`\`\`ts
// server/routers.ts
export const appRouter = router({
myFeature: router({
getData: publicProcedure.query(() => {
// ...
}),
}),
});
\`\`\`
Client-Zugriff: \`trpcClient.myFeature.getData.useQuery()\`

### REST-Route hinzufügen

\`\`\`ts
// server/routes/my-route.ts
import express from 'express';
export const myRoute = express.Router();
myRoute.get('/', (req, res) => { /_ ... _/ });

// server/\_core/index.ts
app.use('/api/my-route', myRoute);
\`\`\`

### Datenbank-Schema ändern

\`\`\`ts
// drizzle/schema.ts — neue Tabelle hinzufügen
export const users = mysqlTable('users', {
id: int().primaryKey().autoincrement(),
name: varchar({ length: 255 }).notNull(),
});

// Terminal
pnpm run db:push

// Generierte Migration committen
git add drizzle/migrations/
\`\`\`

## Debugging & Testing

### HMR funktioniert nicht?

1. \`server/\_core/vite.ts\` prüfen → \`vite.middlewares\` muss korrekt applied sein
2. \`client/index.html\` wird neu geladen? (Browser-Inspektor)
3. \`pnpm dev\` läuft noch? (sollte sichtbar sein in Logs)

### Stripe-Webhook Fehler?

- Middleware-Reihenfolge prüfen (siehe oben!)
- \`.env\` – Webhook Secret gesetzt?
- Logs in \`tmp_debug/assistant_checkpoints.md\`

### Vor PR/Commit

\`\`\`sh
pnpm run check # TypeScript-Fehler?
pnpm run lint # Format + Duplikate?
pnpm test # Tests grün?
pnpm build # Production-Build OK?
\`\`\`

## PR-Checklist

- ✅ **Beschreibung:** Was & Warum kurz erklären
- ✅ **Tests:** Neue/angepasste Tests mitschicken
- ✅ **TypeScript:** \`pnpm run check\` ohne Fehler
- ✅ **@shared-Typen:** Nur wenn nötig; Breaking-Changes dokumentieren
- ✅ **DB-Änderungen:** \`pnpm run db:push\` lokal ausführen, \`drizzle/migrations/\` committen
- ✅ **Secrets:** \`.env\` NIEMALS committen, \`.env.example\` für Vorlagen nutzen
- ✅ **Stripe:** Webhook Signing Key nicht committen!

## VS Code — Tasks & Automation

### Verfügbare Tasks

| Task                             | Befehl                                    | Nutzen                                 |
| -------------------------------- | ----------------------------------------- | -------------------------------------- |
| \`Start Project (start.sh)\`     | \`./scripts/start.sh\`                    | Intelligenter Start (pnpm oder Docker) |
| \`Start Dev Server\`             | \`pnpm dev\`                              | HMR + Hot Reload                       |
| \`Start Dev Server + Open\`      | \`./scripts/start-dev-and-open.sh\`       | Dev-Server + Browser Auto-Open         |
| \`Open Live Preview (External)\` | Opens \`http://localhost:3000\`           | Live-Vorschau in VS Code               |
| \`Automation Assisten\`          | \`node ./scripts/assistant_automate.cjs\` | Multi-Task Automation mit Logging      |

### VS Code Live Preview nutzen

1. Installiere **Live Preview** (Microsoft) Extension
2. Terminal → Run Task → \`Start Dev Server\`
3. Command Palette → \`Live Preview: Show Preview\`
4. Gib \`http://localhost:3000\` ein

### Automation Assisten verwenden

\`\`\`sh

# Terminal (Projekt-Root)

node ./scripts/assistant_automate.cjs

# Oder: VS Code Command Palette → Run Task → "Automation Assisten"

\`\`\`
Logs landen in \`tmp_debug/assistant_checkpoints.md\` (Zeit, Task, Status)

## Schnell-Referenzen

### Umgebungsvariablen

Kopiere \`.env.example\` zu \`.env\` und passe an:
\`\`\`bash
cp .env.example .env

# STRIPE_SECRET, DATABASE_URL, etc. setzen

\`\`\`

### Neue tRPC-Router schnell

Template-Datei: \`server/templates/trpc-router-template.ts\`

### Häufige Fehler

| Fehler                       | Ursache                       | Fix                                               |
| ---------------------------- | ----------------------------- | ------------------------------------------------- |
| "Cannot find module @shared" | Path Alias nicht in tsconfig  | \`tsconfig.json\` prüfen                          |
| Stripe Webhook schlägt fehl  | Middleware-Reihenfolge        | Siehe oben (kritisch!)                            |
| HMR funktioniert nicht       | Vite Middleware nicht richtig | \`server/\_core/vite.ts\` Debug                   |
| Port 3000 belegt             | Anderer Service läuft         | \`findAvailablePort\` fällt auf nächsten Port aus |

## Weitere Informationen

- Detaillierte Automation: \`docs/README_AUTOMATION.md\`
- Stripe Deep-Dive: \`docs/STRIPE_INTEGRATION_GUIDE.md\`
- Deployment & DNS: \`docs/README_AUTOMATION.md\` → "Domain & Deployment"

---

**Zuletzt aktualisiert:** 2025-11-19 | **Sprache:** Deutsch | **Zielgruppe:** Entwickler & AI-Agenten
