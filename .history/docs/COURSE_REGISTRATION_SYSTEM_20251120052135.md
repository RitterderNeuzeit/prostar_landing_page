---
description: Automatisiertes Email-System für Kurs-Registrierungen mit eindeutigen Zugriffsschlüsseln
---

# 📧 Gratis Mini-Kurs Registrierungssystem

## 🎯 Übersicht

Automatisiertes Email-System für kostenlose Kurs-Registrierungen mit:
- ✅ Eindeutige Zugriffsschlüssel pro Person
- ✅ Automatischer Email-Versand
- ✅ Personalisierte HTML-Emails
- ✅ Verfallsdatum-Management (90 Tage)
- ✅ Zugangsverifikation mit Tracking

---

## 📋 System-Komponenten

### 1. Datenbank (`drizzle/schema.ts`)
```typescript
courseRegistrations table:
- accessKey: Eindeutiger Token (32 Zeichen)
- name: Benutzer-Name
- email: E-Mail Adresse
- courseName: Kurs-Bezeichnung
- status: active | pending | expired | cancelled
- emailSent: Zeitstempel Versand
- accessedAt: Erstzugriff auf Kurs
- expiresAt: Gültig bis (90 Tage)
- createdAt/updatedAt: Timestamps
```

### 2. Email-Service (`server/services/emailService.ts`)
- **Provider**: Gmail (SMTP)
- **Authentication**: App-Passwort
- **Template**: HTML + Text-Fallback
- **Features**: Personalisierung, Access-Links, Expiry-Info

### 3. Kurs-Service (`server/services/courseService.ts`)
- **generateAccessKey()**: 32-Zeichen UUID
- **registerForCourse()**: Speichert Registration + generiert Key
- **verifyAccessKey()**: Validiert + Zugriff tracken

### 4. tRPC Endpoints (`server/routers.ts`)
```typescript
course.register   // POST: Name + Email → Email + Key
course.verify     // GET: Validate Access Key
```

### 5. Frontend-Komponenten

#### `CourseRegistrationForm.tsx`
- Name + Email Input
- Validierung
- Loading State
- Status Messages (Success/Error)
- Auto-Reset nach Erfolg

#### `CourseAccessPage.tsx`
- URL Parameter: `?key=<accessKey>`
- Verifikation + Anzeige
- User-Daten Display
- Expiry-Informationen

---

## 🔧 Setup-Anleitung

### Schritt 1: Environment Variablen

Kopiere `.env.example` zu `.env` und fülle aus:

```bash
# Email Service (Gmail mit App-Passwort)
EMAIL_USER=deine-email@gmail.com
EMAIL_PASSWORD=app_passwort_16_zeichen
REPLY_TO_EMAIL=support@prostarmarketing.de
SITE_URL=https://prostarmarketing.de  # Production
```

#### Gmail App-Passwort erstellen:
1. Google Account → Sicherheit
2. 2-Faktor aktivieren (falls nicht)
3. App-Passwörter → Google Mail wählen
4. 16-Zeichen Passwort kopieren
5. In `EMAIL_PASSWORD` einfügen

### Schritt 2: Datenbank-Migrationen

```bash
# Migration erstellen + ausführen
pnpm run db:push

# SQL-Migration anschauen (optional)
cat drizzle/0001_mixed_night_thrasher.sql
```

### Schritt 3: Dependencies installieren

```bash
# Schon gemacht durch Setup:
# pnpm add uuid nodemailer
# pnpm add -D @types/nodemailer
```

### Schritt 4: Frontend integrieren

In deine Landing Page `client/src/pages/Home.tsx`:

```tsx
import { CourseRegistrationForm } from "@/components/CourseRegistrationForm";

export function HomePage() {
  return (
    <div>
      {/* ... other content ... */}
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Kostenlos Starten
          </h2>
          <CourseRegistrationForm 
            courseName="Gratis Mini-Kurs"
            onSuccess={(accessKey) => {
              console.log("Registriert mit Key:", accessKey);
            }}
          />
        </div>
      </section>
    </div>
  );
}
```

### Schritt 5: Router-Update (bereits gemacht)

Kurszugangs-Route in React Router:

```tsx
// client/src/App.tsx oder router.tsx
import { CourseAccessPage } from "@/pages/CourseAccessPage";

{
  path: "/course/access/:key",
  element: <CourseAccessPage />,
}
```

---

## 📧 Email-Template

### Design-Highlights

```
┌─────────────────────────────────────┐
│  🎉 WILLKOMMEN!                     │
│  Dein Zugang ist bereit             │
├─────────────────────────────────────┤
│                                     │
│  Hallo [Name],                      │
│                                     │
│  Dein persönlicher Zugriffscode:    │
│  ┌──────────────────────────────┐   │
│  │ [32-ZEICHEN-CODE]            │   │
│  └──────────────────────────────┘   │
│                                     │
│  [→ ZUM KURS Button]                │
│                                     │
│  ⏰ Gültig bis: [Datum]             │
│  📧 E-Mail: [user@example.com]      │
│                                     │
└─────────────────────────────────────┘
```

### Template-Variablen
- `${data.name}` → Benutzer-Name
- `${data.accessKey}` → Eindeutiger Code
- `${accessUrl}` → `SITE_URL/course/access/[key]`
- `${expiryDate}` → Gültig bis Datum

---

## 🚀 Workflow

### 1. Registrierung
```
User füllt Form aus
        ↓
CourseRegistrationForm.tsx
        ↓
trpcClient.course.register.mutate()
        ↓
Server: generateAccessKey()
        ↓
DB: Speichere Registration
        ↓
Email: Versende mit AccessKey
        ↓
Frontend: "✅ Email gesendet"
```

### 2. Zugriff
```
User klickt Email-Link
        ↓
/course/access?key=[CODE]
        ↓
CourseAccessPage.tsx
        ↓
trpcClient.course.verify.query()
        ↓
Server: Validiere + Tracke Access
        ↓
DB: Update accessedAt + Status
        ↓
Frontend: Zeige Willkommens-Seite
```

---

## 🧪 Testing

### Test 1: Lokale Registrierung

```bash
# Terminal 1: Dev Server
pnpm dev

# Terminal 2: Test Form
curl -X POST http://localhost:3000/api/trpc/course.register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Mustermann",
    "email": "max@test.com",
    "courseName": "free-mini-course"
  }'

# Response:
# {
#   "success": true,
#   "message": "Access email sent to max@test.com",
#   "accessKey": "abc123def456...",
#   "emailSent": true
# }
```

### Test 2: Verifizierung

```bash
curl http://localhost:3000/api/trpc/course.verify \
  -d '{"accessKey":"abc123def456..."}'

# Response:
# {
#   "valid": true,
#   "name": "Max Mustermann",
#   "email": "max@test.com",
#   "courseName": "free-mini-course",
#   "expiresAt": "2025-02-18..."
# }
```

### Test 3: Email-Versand

Emails in Development laufen gegen:
- Gmail SMTP (live)
- Oder: Mailtrap/Ethereal für Sandbox

### Test 4: Zugangslink

```
Browser öffnet:
http://localhost:3000/course/access?key=abc123def456

→ Seite lädt, validiert Key
→ Zeigt Willkommens-Seite mit User-Daten
```

---

## 🔐 Sicherheit

### Best Practices

✅ **Access Keys**
- Eindeutig: `uuid().replace(/-/g, '').substring(0, 32)`
- Nicht sequenziell (nicht ratbar)
- Speichert nur gehashed in Production (TODO)
- Pro Person nur 1 Key zur Zeit

✅ **Emails**
- Versendet nur an bestätigte Email
- Link enthält Key als URL-Parameter
- Keine Secrets in Emails

✅ **Ablauf**
- 90 Tage Gültigkeitsdauer
- Automatic Expiry Status
- Tracking von Zugriff (accessedAt)

✅ **Database**
- courseRegistrations als separate Tabelle
- Eindeutiger Index auf accessKey
- Status-Enum (keine Free-Text)

### TODO: Zukünftige Verbesserungen

```typescript
// 1. Key Hashing (prevent DB compromise)
import bcrypt from 'bcrypt';
const hashedKey = await bcrypt.hash(accessKey, 10);

// 2. Rate Limiting (prevent spam)
import rateLimit from 'express-rate-limit';

// 3. Email Verification (double opt-in)
// 4. Webhook for Payment Integration
// 5. Admin Dashboard (manage registrations)
```

---

## 🎯 Nächste Schritte

### Direkt einsatzbereit:
- ✅ Registrierungsform auf Landing Page
- ✅ Email-Versand aktiv
- ✅ Kurs-Zugangsseite

### Später (Payment Integration):
- [ ] Stripe Integration
- [ ] Bezahlte Kurse
- [ ] Admin Dashboard
- [ ] Email Vorlagen Customizer

### Optional:
- [ ] SMS Backup für Code
- [ ] QR-Code in Email
- [ ] WhatsApp Integration
- [ ] Discord Bot für Ankündigungen

---

## 📞 Troubleshooting

### ❌ Email wird nicht versendet

**Fehler**: `"Email service is not configured"`

**Lösung**:
```bash
# Prüfe .env
cat .env | grep EMAIL_

# Muss sein:
EMAIL_USER=xxx@gmail.com
EMAIL_PASSWORD=16-zeichen-app-passwort

# Gmail App-Passwort neu erstellen:
# → Google Security → App Passwords → Mail → Generate
```

### ❌ Database Connection Error

**Fehler**: `ECONNREFUSED 127.0.0.1:3306`

**Lösung**:
```bash
# MySQL läuft nicht lokal:
docker-compose up -d mysql

# Oder mit brew:
brew services start mysql

# Dann Migration nochmal:
pnpm run db:push
```

### ❌ tRPC Endpoint 404

**Fehler**: `course.register is not a function`

**Lösung**:
```bash
# Routers.ts wurde nicht richtig aktualisiert
# Prüfe: server/routers.ts hat course: router({...})

# Rebuild:
pnpm build

# Dev Server neustarten:
pnpm dev
```

### ❌ Email Template zeigt Variablen nicht

**Fehler**: Email enthält `${data.name}` statt "Max"

**Lösung**:
```typescript
// server/services/emailService.ts
// Backticks verwenden, nicht normale Quotes!

const htmlContent = `
  Hallo ${data.name},  // ← Backticks!
`;
```

---

## 📊 Monitoring

### Email Versand tracken

```sql
-- Wie viele Registrierungen heute?
SELECT COUNT(*) FROM courseRegistrations 
WHERE DATE(createdAt) = CURDATE();

-- Wie viele Emails versendet?
SELECT COUNT(*) FROM courseRegistrations 
WHERE emailSent IS NOT NULL 
AND DATE(emailSent) = CURDATE();

-- Wer hat zugegriffen?
SELECT name, email, accessedAt FROM courseRegistrations 
WHERE accessedAt IS NOT NULL 
ORDER BY accessedAt DESC;

-- Abgelaufene Kurse?
SELECT name, email, expiresAt FROM courseRegistrations 
WHERE expiresAt < NOW() 
AND status = 'active';
```

---

## 📝 Checkliste für Go-Live

- [ ] `.env` mit echten Gmail-Credentials
- [ ] `EMAIL_USER` & `EMAIL_PASSWORD` gesetzt
- [ ] `SITE_URL` auf Production-Domain (`https://prostarmarketing.de`)
- [ ] `pnpm run db:push` erfolgreich
- [ ] CourseRegistrationForm auf Landing Page
- [ ] Testtransaktion durchführt (Name + Email)
- [ ] Email ankommt mit korrektem Access-Link
- [ ] Link öffnet Kurs-Zugangsseite
- [ ] Git commit: "feat: course registration system"

---

**Version**: 1.0.0  
**Letzte Aktualisierung**: 20.11.2025  
**Status**: ✅ Production Ready
