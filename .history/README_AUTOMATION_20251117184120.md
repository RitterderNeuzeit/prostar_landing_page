# Automation assisten — Einfache Anleitung (Anfänger-Level)

Diese Datei erklärt Schritt für Schritt, was der "Automation assisten" macht und wie du ihn sicher lokal verwendest. Alles ist so erklärt, dass auch Einsteiger es verstehen.

Kurz: was passiert
- Der Assistent fragt dich kurz, welche Befehle ausgeführt werden sollen (z. B. `pnpm run check; pnpm dev`).
- Er wartet 10 Sekunden auf deine Eingabe. Wenn du nichts eingibst, führt er eine sichere Standardliste aus.
- Jede Aufgabe wird nacheinander ausgeführt. Für lange Aufgaben wie `pnpm dev` startet er den Prozess im Hintergrund.
- Ergebnisse werden in `tmp_debug/assistant_checkpoints.md` protokolliert.

Beispiele — ausführen
- In VS Code: Öffne Command Palette → Run Task → `Automation Assisten`.
- Terminal (im Projektordner):
```zsh
node ./scripts/assistant_automate.cjs
```
- Direkt Befehle übergeben (kein Dev-Server):
```zsh
printf "echo hallo; pnpm run check\n" | node ./scripts/assistant_automate.cjs
```

Wo die Protokolle sind
- `tmp_debug/assistant_checkpoints.md` — enthält Zeit, Aufgabe und kurzen Status (start/done/error).

Wichtige Sicherheitshinweise (einfach)
- Alles läuft lokal. Das Skript lädt nichts hoch.
- Gib keine gefährlichen Befehle ein (z. B. `rm -rf /`) oder Befehle, die Secrets ausgeben.
- Das Skript hat Timeouts pro Befehl, damit es nicht ewig hängt.

Domain, Deployment und externe Anbindungen (kurz und klar)

1) Entwicklung vs. Produktion
- Lokal (Entwicklung): `pnpm dev` startet einen Entwicklungsserver mit Hot Reload. Gut zum Testen.
- Produktion: Du baust mit `pnpm build` und startest die gebaute Version (z. B. `node dist/index.js`) auf einem Server.

2) Domain & DNS (sehr einfach)
- Kaufe eine Domain bei einem Provider (z. B. Cloudflare, IONOS, GoDaddy).
- Beim Hosten (z. B. Vercel, Netlify, Render, DigitalOcean, AWS): der Provider gibt dir IP-Adressen oder CNAMEs.
- Im Domain-Provider trägst du die DNS-Einträge ein (A-Record oder CNAME), damit deine Domain auf den Server zeigt.

3) HTTPS / SSL (wichtig)
- Für Sicherheit brauchst du HTTPS. Viele Hosting-Provider geben automatisch ein TLS-Zertifikat (Let's Encrypt).
- Wenn du selbst hostest, konfiguriere einen Reverse-Proxy (z. B. Nginx) und nutze Certbot für Let's Encrypt.

4) Environment‑Variablen & Secrets
- Produktion: lege sensible Werte in Umgebungsvariablen (z. B. `STRIPE_SECRET`, `DATABASE_URL`, `JWT_SECRET`).
- Niemals Secrets ins Repository committen.

5) Stripe / Webhooks (WICHTIG)
- Stripe-Webhooks müssen auf deinen Server zeigen (z. B. `https://yourdomain.com/api/stripe/webhook`).
- Der Server erwartet rohe JSON-Body (express.raw), deshalb darf die Webhook-Route nicht nach `express.json()` registriert werden.

6) Kurzanleitung: Von lokal zu live (einfach)
 - Baue das Projekt: `pnpm build`
 - Lade das Verzeichnis `dist` auf deinen Server oder nutze einen Host (z. B. Vercel)
 - Setze Environment-Variablen beim Hoster (z. B. STRIPE keys)
 - Konfiguriere DNS so, dass die Domain auf den Hoster/Server zeigt
 - Teste HTTPS und die API-Endpunkte

Wenn du möchtest, schreibe ich eine detaillierte Schritt-für-Schritt-Anleitung für einen bestimmten Hoster (z. B. Vercel oder DigitalOcean). Sag mir welchen Hoster du bevorzugst.
