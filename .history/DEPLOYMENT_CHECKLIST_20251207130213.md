# 🚀 Railway Deployment - Master Checklist

## 📊 AKTUELLER STATUS (7. Dez 2025, 12:54 UTC)

### ✅ Was funktioniert:
- Railway Projekt erstellt: `dependable-youthfulness`
- Service erstellt: `prostar_landing_page--1-`
- Railway Domain verfügbar: `prostarlandingpage-1-production.up.railway.app`
- GitHub Repository verbunden
- Scripts erstellt für Auto-Setup

### ❌ Was noch fehlt:
- [ ] Environment Variables in Railway setzen
- [ ] Deployment Status: ACTIVE (aktuell: CRASHED)
- [ ] DNS CNAME auf Railway umstellen (zeigt noch auf Squarespace)
- [ ] Custom Domain in Railway hinzufügen
- [ ] SSL-Zertifikat generiert

---

## 🎯 AUFGABEN-LISTE (In dieser Reihenfolge!)

### Phase 1: Railway Deployment fixen ⚠️ KRITISCH

- [ ] **1.1 Environment Variables setzen**
  ```bash
  # Script ausführen:
  bash generate-env-vars.sh
  
  # Dann:
  # 1. Öffne: railway-env-vars.txt
  # 2. Ersetze alle <PLATZHALTER> mit echten Werten
  # 3. Railway Dashboard öffnen
  # 4. Variables Tab → Raw Editor → Alles einfügen
  # 5. Save klicken
  ```
  
  **Wichtigste Variables:**
  - `DATABASE_URL` - Azure MySQL Connection String
  - `JWT_SECRET` - (wird automatisch generiert)
  - `EMAIL_USER` + `EMAIL_PASSWORD` - Gmail mit App-Passwort
  - `STRIPE_SECRET_KEY` - Stripe API Key
  
  **Links:**
  - Railway Variables: https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619
  - Gmail App-Passwort: https://myaccount.google.com/apppasswords
  - Stripe Keys: https://dashboard.stripe.com/test/apikeys

- [ ] **1.2 Deployment überwachen**
  ```bash
  # Status prüfen:
  bash check-deployment.sh
  
  # Railway sollte automatisch re-deployen nach Variables-Änderung
  # Warte 2-5 Minuten
  ```
  
  **Erwartetes Ergebnis:**
  - Deployment Status: ACTIVE (grün)
  - HTTP Response: 200 (nicht 502)
  - Landing Page lädt auf Railway-URL

- [ ] **1.3 Railway App testen**
  ```bash
  # Im Browser öffnen:
  open https://prostarlandingpage-1-production.up.railway.app
  ```
  
  **Prüfe:**
  - ✅ Seite lädt ohne Fehler
  - ✅ Keine 502 Errors
  - ✅ Registrierung erreichbar
  - ✅ Login-Seite erreichbar

---

### Phase 2: DNS konfigurieren

- [ ] **2.1 CNAME bei Google Domains ändern**
  ```bash
  # Anleitung anzeigen:
  bash update-dns.sh
  
  # Oder manuell:
  # 1. https://domains.google.com
  # 2. prostarmarketing.de → DNS
  # 3. CNAME 'kurs' bearbeiten
  # 4. Von: ext-sq.squarespace.com
  # 5. Zu: prostarlandingpage-1-production.up.railway.app
  # 6. Speichern
  ```

- [ ] **2.2 DNS Propagation abwarten**
  ```bash
  # Status prüfen (alle 5 Min):
  dig kurs.prostarmarketing.de CNAME +short
  
  # Sollte zeigen:
  # prostarlandingpage-1-production.up.railway.app.
  
  # Online-Check:
  # https://dnschecker.org/#CNAME/kurs.prostarmarketing.de
  ```
  
  **Wartezeit:** 15-60 Minuten (meist 30 Min)

- [ ] **2.3 DNS-Änderung verifizieren**
  ```bash
  # Final Check:
  dig kurs.prostarmarketing.de CNAME +short
  
  # Muss zurückgeben:
  # prostarlandingpage-1-production.up.railway.app.
  ```

---

### Phase 3: Custom Domain in Railway

- [ ] **3.1 Custom Domain hinzufügen**
  ```
  1. Railway Dashboard öffnen:
     https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619
  
  2. Service 'prostar_landing_page--1-' öffnen
  
  3. Settings → Domains
  
  4. "Custom Domain" klicken
  
  5. Eingeben: kurs.prostarmarketing.de
  
  6. "Add" klicken
  ```

- [ ] **3.2 SSL-Zertifikat warten**
  ```
  Railway generiert automatisch Let's Encrypt SSL
  
  Status prüfen:
  - ✅ Grünes Häkchen → SSL aktiv
  - ⏳ Orange Warnung → DNS noch nicht propagiert (warte)
  - ❌ Roter Fehler → DNS falsch konfiguriert (prüfe CNAME)
  ```
  
  **Wartezeit:** 5-15 Minuten

- [ ] **3.3 HTTPS-Zugriff testen**
  ```bash
  # Im Browser:
  open https://kurs.prostarmarketing.de
  
  # Status prüfen:
  bash check-deployment.sh
  ```

---

### Phase 4: Finale Tests

- [ ] **4.1 Funktionstest**
  ```
  Browser: https://kurs.prostarmarketing.de
  
  Prüfe:
  - [ ] Seite lädt ohne Fehler
  - [ ] SSL aktiv (grünes Schloss)
  - [ ] Registrierung funktioniert
  - [ ] Login funktioniert
  - [ ] E-Mail erhalten (Bestätigung)
  - [ ] Cookie gesetzt (DevTools → Application)
  - [ ] Kurs-Zugriff nach Login
  - [ ] Passwort-Reset funktioniert
  - [ ] Mobile responsive (Chrome DevTools)
  ```

- [ ] **4.2 Performance-Test**
  ```bash
  # Ladezeit prüfen:
  curl -o /dev/null -s -w "Time: %{time_total}s\nStatus: %{http_code}\n" \
    https://kurs.prostarmarketing.de
  
  # Sollte sein:
  # Time: < 2s
  # Status: 200
  ```

- [ ] **4.3 Production Checklist**
  ```
  - [ ] Stripe Webhook konfiguriert
  - [ ] E-Mail-Versand funktioniert
  - [ ] Fehler-Logs sauber (keine kritischen Errors)
  - [ ] Railway Monitoring aktiviert
  - [ ] Backup-Strategie definiert (Azure MySQL)
  ```

---

## 🔧 TROUBLESHOOTING

### Problem: Deployment bleibt bei "CRASHED"

**Symptome:**
- Railway Deployment Status: CRASHED
- HTTP 502 auf Railway-URL
- Keine Logs sichtbar

**Lösung:**
```bash
1. Railway Dashboard → Deployments Tab
2. Letztes Deployment anklicken
3. "Deploy Logs" prüfen

Häufige Fehler:
- "Cannot connect to database" → DATABASE_URL prüfen
- "Missing environment variable" → Variables Tab prüfen
- "Port already in use" → PORT=3000 setzen
```

### Problem: DNS ändert sich nicht

**Symptome:**
- dig zeigt noch ext-sq.squarespace.com
- Nach 2+ Stunden keine Änderung

**Lösung:**
```bash
1. DNS-Cache leeren:
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder

2. Google Domains nochmal prüfen:
   - Einstellung gespeichert?
   - Tippfehler in Railway-URL?

3. Alternative DNS-Server testen:
   dig @8.8.8.8 kurs.prostarmarketing.de CNAME +short
```

### Problem: SSL-Zertifikat wird nicht generiert

**Symptome:**
- Railway zeigt roten Fehler bei Custom Domain
- HTTPS nicht erreichbar

**Lösung:**
```bash
1. DNS MUSS auf Railway zeigen!
   dig kurs.prostarmarketing.de CNAME +short

2. Warte 30-60 Min nach DNS-Änderung

3. Custom Domain entfernen und neu hinzufügen:
   - Railway → Settings → Domains
   - Custom Domain löschen
   - 5 Min warten
   - Custom Domain neu hinzufügen
```

---

## 📋 QUICK COMMANDS

```bash
# Status-Check (alles prüfen)
bash check-deployment.sh

# Environment Variables generieren
bash generate-env-vars.sh

# DNS Update Anleitung
bash update-dns.sh

# DNS Status live prüfen
watch -n 10 'dig kurs.prostarmarketing.de CNAME +short'

# Railway App testen
curl -I https://prostarlandingpage-1-production.up.railway.app

# Custom Domain testen
curl -I https://kurs.prostarmarketing.de
```

---

## 🎯 FORTSCHRITT TRACKING

**Aktueller Stand:**

Phase 1: Railway Deployment fixen
- [x] Scripts erstellt
- [ ] Variables gesetzt
- [ ] Deployment ACTIVE

Phase 2: DNS konfigurieren
- [ ] CNAME geändert
- [ ] DNS propagiert

Phase 3: Custom Domain
- [ ] Domain hinzugefügt
- [ ] SSL generiert

Phase 4: Tests
- [ ] Funktionstest
- [ ] Performance-Test
- [ ] Production Ready

---

## 📞 SUPPORT

**Bei Problemen:**

1. **Deployment Logs prüfen**
   ```
   Railway → Deployments → Deploy Logs
   Kopiere relevante Error-Zeilen
   ```

2. **DNS Status prüfen**
   ```bash
   dig kurs.prostarmarketing.de CNAME +short
   ```

3. **Status-Check ausführen**
   ```bash
   bash check-deployment.sh
   ```

4. **GitHub Issues**
   https://github.com/AIHubcom/prostar_landing_page--1-/issues

---

## ✅ ERFOLG!

**Wenn alles funktioniert:**

```bash
✅ Railway Deployment: ACTIVE
✅ Railway App: HTTP 200
✅ DNS: zeigt auf Railway
✅ Custom Domain: SSL aktiv
✅ https://kurs.prostarmarketing.de lädt
✅ Alle Funktionen getestet
```

**Geschätzte Gesamtzeit:** 60-90 Minuten (inkl. Wartezeiten)

---

**Zuletzt aktualisiert:** 7. Dez 2025, 12:54 UTC
