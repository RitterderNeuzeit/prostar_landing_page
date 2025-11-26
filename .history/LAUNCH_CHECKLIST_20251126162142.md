# 🚦 LAUNCH_CHECKLIST.md

Diese Checkliste führt dich Schritt für Schritt durch alle sicherheitsrelevanten und produktiven Aufgaben für den Go-Live und Kursverkauf auf www.prostarmarketing.de/kurs (Ubuntu-Server-Hosting).

## 1. Sicherheit & Infrastruktur

- [ ] HTTPS/SSL für Domain einrichten (z.B. Let's Encrypt)
- [ ] .env/Secrets absichern (keine Secrets ins Repo, nur auf Server)
- [ ] Rate Limiting & Brute-Force-Schutz (express-rate-limit)
- [ ] CORS-Policy auf www.prostarmarketing.de beschränken
- [ ] Input-Validierung & Sanitizing überall (Backend & Frontend)
- [ ] Security-Header aktivieren (helmet für Express)
- [ ] Stripe Webhook-Signatur regelmäßig testen
- [ ] Logging, Monitoring & Backups einrichten
- [ ] DSGVO/Datenschutz, Impressum, AGB, Widerruf-Seiten einbauen

## 2. Go-Live-Vorbereitung

- [ ] Domain & DNS auf Ubuntu-Server zeigen lassen
- [ ] Deployment auf Ubuntu-Server (mit HTTPS)
- [ ] Stripe Live-Keys & SMTP-Produktivdaten eintragen
- [ ] Kursinhalte, Branding, Support-Kontakt einpflegen
- [ ] Testkäufe & End-to-End-Tests im Live-System
- [ ] Analytics & Cookie-Consent einrichten

## 3. Launch & Betrieb

- [ ] System öffentlich schalten
- [ ] Monitoring & Error-Alerting aktiv überwachen
- [ ] Support & Kundenkommunikation sicherstellen
- [ ] Regelmäßige Backups & Security-Updates durchführen
- [ ] Feedback sammeln & Optimierungen einplanen

---

**Hinweis:**
- Für Ubuntu-Server-Deployment werden ggf. weitere Infos benötigt (SSH-Zugang, Firewall, Reverse Proxy, etc.).
- Bei Fragen zu einzelnen Schritten einfach melden – ich unterstütze gerne mit konkreten Befehlen, Konfigurationen oder Code!
