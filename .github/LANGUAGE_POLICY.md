# Sprachrichtlinie — Language Policy

**Zielgruppe:** Entwickler, AI-Agenten, Mitwirkende

## Kurzregel (TL;DR)

- 📝 **Dokumentation & README:** **Deutsch**
- 💬 **Code-Kommentare:** **Deutsch** (projektspezifisch) oder **Englisch** (Standard-Patterns)
- 🔧 **APIs & Type-Definitionen:** **Englisch**
- 📦 **npm-Scripts & Befehle:** **Englisch** (Standard)
- 🤖 **AI-Agenten-Anweisungen:** **Deutsch**

---

## Detaillierte Richtlinien

### 1. **Dokumentation & README** 📚

| Datei                             | Sprache     | Begründung                                                            |
| --------------------------------- | ----------- | --------------------------------------------------------------------- |
| `README.md`                       | 🇩🇪 Deutsch  | Zielgruppe: Deutsche Entwickler & Kunden                              |
| `.github/copilot-instructions.md` | 🇩🇪 Deutsch  | AI-Agenten (Copilot, Claude) nutzen dieses Projekt primär mit Deutsch |
| `.github/LANGUAGE_POLICY.md`      | 🇩🇪/🇬🇧 Beide | Richtlinien-Dokument                                                  |
| `CONTRIBUTING.md`                 | 🇩🇪 Deutsch  | Einsteiger-freundlich für deutschsprachige Mitwirkende                |
| `docs/*.md`                       | 🇩🇪 Deutsch  | Interne Dokumentation, Deployment-Guides, Tutorials                   |
| `.env.example`                    | 🇬🇧 Englisch | Standard-Convention (Umgebungsvariablen-Namen)                        |

### 2. **Code-Kommentare** 💬

**Regel:** Deutsch für repo-spezifische Logik, Englisch für Standard-Patterns

```ts
// ✅ GUT: Deutsch für repo-spezifische Middleware-Reihenfolge
// WICHTIG: express.raw() MUSS vor express.json() registriert sein!
// Sonst bricht die Stripe-Webhook-Signaturprüfung.
app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookRoute
);
app.use(express.json());

// ✅ GUT: Englisch für Standard-Pattern
// Initialize tRPC server instance
const t = initTRPC.create();

// ❌ SCHLECHT: Englisch für kritische repo-Logik
// Set up Express server with custom middleware order
// (Verwirrt neue Entwickler, die Deutsch sprechen)
```

**Häufige Code-Kommentartypen:**

| Typ                       | Beispiel                             | Sprache     |
| ------------------------- | ------------------------------------ | ----------- |
| **Kritische Reihenfolge** | "WICHTIG: Middleware-Reihenfolge..." | 🇩🇪 Deutsch  |
| **Hack/Workaround**       | "Patch für wouter@3.7.1..."          | 🇩🇪 Deutsch  |
| **API-Verhalten**         | `// Returns tRPC router`             | 🇬🇧 Englisch |
| **Standard-Patterns**     | `// Initialize trpc context`         | 🇬🇧 Englisch |

### 3. **APIs & Type-Definitionen** 🔧

**Immer Englisch** (Standard-Convention für TypeScript/JavaScript):

```ts
// ✅ Englisch
export type CreateUserInput = z.infer<typeof createUserSchema>;

// ✅ Englisch
export const getUserById = publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    // ...
  });

// ❌ Nicht Deutsch
export type BenutzererstellungInput = ...;
```

**JSDoc-Kommentare:**

```ts
// ✅ Englisch (Standard für APIs)
/**
 * Fetches a user by ID from the database
 * @param id - User ID
 * @returns User object or null
 */
export async function getUserById(id: number) { ... }

// ✅ Deutsch (für repo-spezifische Helpers)
/**
 * Validiert Stripe-Webhook-Signatur
 * @param signature - Webhook-Signatur Header
 * @param secret - Webhook-Signing-Secret aus .env
 * @returns true wenn valide, sonst false
 */
export function validateStripeSignature(signature: string, secret: string) { ... }
```

### 4. **npm-Scripts & Befehle** 📦

**Englisch** (Standard-Convention):

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
    "build": "vite build && esbuild...",
    "start": "NODE_ENV=production node dist/index.js",
    "format:check": "prettier --check .",
    "duplication:check": "jscpd . --ignore '**/*.json'"
  }
}
```

✅ Script-Namen: Englisch (npm-Standard)  
✅ Kommentare in `package.json`: Minimal, nur wenn nötig

### 5. **AI-Agenten-Anweisungen** 🤖

**Deutsch** (primäre Sprache für dieses Projekt):

- `.github/copilot-instructions.md` → Deutsch
- Inline-Kommentare für kritische Logik → Deutsch

---

## Exceptions & Edge Cases

### Exception 1: Externe Dependencies

```ts
// ✅ Englisch (Externe Library)
import { Router } from "wouter"; // React Router Library
```

### Exception 2: GitHub Issues & PRs

- **Title:** Deutsch (für deutschsprachige Mitwirkende)
- **Description:** Deutsch (wenn Deutsch ist die Kommunikationssprache)
- **Labels:** Englisch (GitHub-Standard: `bug`, `feature`, `documentation`)

### Exception 3: Comments in Migrationsdateien

```sql
-- ✅ Englisch (Schema ist standardisiert)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE
);
```

---

## Best Practices

### ✅ DO

- **Misch nicht Sprachen im selben Kommentar-Block**

  ```ts
  // ✅ GUT
  // WICHTIG: Middleware-Reihenfolge
  app.use(express.raw(...)); // Before express.json()
  ```

- **Nutze Deutsch für kritische Warnung**

  ```ts
  // ⚠️ WICHTIG: Diese Reihenfolge darf nicht geändert werden!
  ```

- **Halte Englisch für universelle Patterns**
  ```ts
  // Initialize server
  ```

### ❌ DON'T

- **Nicht komplett Englisch für repo-spezifische Logik**

  ```ts
  // ❌ FALSCH
  // This order matters because Stripe webhook needs raw body
  // (Verwirrt deutschsprachige Entwickler)
  ```

- **Nicht komplett Deutsch für Standard-Code**
  ```ts
  // ❌ FALSCH
  // Initialisiere tRPC Server-Instanz
  const t = initTRPC.create();
  ```

---

## Checkliste für Mitwirkende

- ✅ README, Docs, Guides: **Deutsch**
- ✅ `.github/copilot-instructions.md`: **Deutsch**
- ✅ Type-Definitionen, APIs: **Englisch**
- ✅ Critical Repo-Logik-Kommentare: **Deutsch**
- ✅ Standard-Pattern-Kommentare: **Englisch**
- ✅ PR-Beschreibung: **Deutsch** (oder falls English-PR, dann klar kennzeichnen)

---

## Fragen & Feedback

Wenn du unsicher bist, welche Sprache du nutzen sollst:

1. **Ist es kritisch für dieses Projekt?** → Deutsch
2. **Ist es ein Standard-Pattern?** → Englisch
3. **Verstehen Englisch-sprechende Entwickler das auch?** → Englisch OK
4. **Braucht ein Anfänger Deutsch für diese Info?** → Deutsch

---

**Version:** 1.0  
**Gültig ab:** 2025-11-19  
**Status:** Aktiv
