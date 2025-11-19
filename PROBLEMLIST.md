# Kurz-Problemliste — schnell handlungsfähig

1. `pnpm` fehlt in dieser Umgebung — ohne `pnpm` startet `pnpm dev` nicht.
   - Aktion: `pnpm` lokal installieren (Anleitung unten).

2. `.env` fehlt reale Werte — ohne DB/Stripe-Keys startet evtl. die App nicht korrekt.
   - Aktion: `cp .env.example .env` und Werte ergänzen (DB, JWT, Stripe optional).

3. TypeScript-Fehler blockieren Build (wenn vorhanden) — `pnpm run check` ausführen.
   - Aktion: `pnpm run check` ausführen und Fehler beheben.

4. Dev-Server: `pnpm dev` startet Express + Vite. Wenn Port belegt, wählt die App einen anderen Port.
   - Aktion: `pnpm dev` starten und die Konsole auf Fehler prüfen.

Kurzanleitung (was du lokal tun musst)

```bash
# 1) Node (>=18) installieren falls nötig
# 2) pnpm installieren (eine Option):
npm install -g pnpm
# 3) Projekt starten
cp .env.example .env
pnpm install
pnpm run check
pnpm dev
```

Wenn du möchtest, führe die obigen Befehle lokal aus und schicke mir die komplette Fehlermeldung aus der Konsole — ich behebe die nächsten Schritte dann gezielt.
