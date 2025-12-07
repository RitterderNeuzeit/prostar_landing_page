# 🚨 WICHTIG: DNS MUSS GEÄNDERT WERDEN!

## ❌ AKTUELLER STATUS (7. Dez 2025, 11:42 UTC)

```
DNS CNAME:  kurs.prostarmarketing.de → ext-sq.squarespace.com
Server:     Squarespace (FALSCH!)
SSL:        Let's Encrypt (vorhanden, aber auf Squarespace)
Redirect:   301 zu prostarmarketing.de.test-google-a.com (Google Verification)
```

**Problem**: Der DNS CNAME zeigt auf **Squarespace**, NICHT auf **Railway**!

---

## ✅ WAS DU JETZT TUN MUSST

### SCHRITT 1: Railway URL herausfinden

1. Gehe zu: https://railway.app
2. Öffne dein Projekt
3. Klicke auf dein Deployment
4. **Settings** → **Domains**
5. Notiere die URL (z.B. `prostar-production-abc123.up.railway.app`)

**Oder: Sieh im Railway Dashboard nach "Deployments"**

---

### SCHRITT 2: DNS CNAME ändern

Du hast **2 Möglichkeiten** wo du DNS verwaltest:

#### Option A: Google Domains (Nameserver: ns-cloud-a1.googledomains.com)

```
1. Gehe zu: https://domains.google.com
2. Wähle: prostarmarketing.de
3. Linke Seite: "DNS" klicken
4. Scrolle zu "Custom resource records" (Custom DNS-Einträge)
5. SUCHE den Eintrag:
   
   Name:  kurs
   Type:  CNAME
   Data:  ext-sq.squarespace.com  ← DAS MUSS WEG!
   
6. Klicke auf "Edit" (Stift-Symbol)
7. ÄNDERE "Data" zu deiner Railway URL:
   
   Name:  kurs
   Type:  CNAME
   TTL:   1H
   Data:  prostar-production-abc123.up.railway.app  ← DEINE Railway URL!
   
8. Speichern
```

**WICHTIG**: 
- Railway URL **OHNE** `https://`!
- Railway URL **MIT** `.up.railway.app` am Ende!

#### Option B: Squarespace DNS Settings

```
1. Gehe zu: https://account.squarespace.com
2. Wähle deine Website
3. Settings → Domains → prostarmarketing.de
4. Klicke "Advanced Settings" oder "DNS Settings"
5. SUCHE den CNAME-Eintrag:
   
   Host:  kurs
   Type:  CNAME
   Data:  ext-sq.squarespace.com  ← LÖSCHEN!
   
6. Klicke "Edit" oder "Delete"
7. ERSETZE mit:
   
   Host:  kurs
   Type:  CNAME
   Data:  prostar-production-abc123.up.railway.app  ← DEINE Railway URL!
   
8. Speichern
```

---

### SCHRITT 3: Warten (15-60 Min.)

DNS-Änderungen brauchen Zeit!

**Prüfen mit**:

```bash
# Im Terminal:
dig kurs.prostarmarketing.de CNAME +short

# VORHER (jetzt):
ext-sq.squarespace.com.

# NACHHER (nach DNS-Änderung):
prostar-production-abc123.up.railway.app.
```

**Online prüfen**: https://dnschecker.org/#CNAME/kurs.prostarmarketing.de

---

### SCHRITT 4: Custom Domain in Railway hinzufügen

**ERST NACHDEM DNS auf Railway zeigt!**

```
1. Railway → Dein Projekt
2. Settings → Domains
3. Klicke "Add Custom Domain"
4. Eingeben: kurs.prostarmarketing.de
5. Klicke "Add"
```

Railway prüft jetzt:
- ✅ DNS zeigt auf Railway → SSL wird automatisch generiert
- ❌ DNS zeigt woanders → Fehler wird angezeigt

---

## 🔍 DEBUGGING-BEFEHLE

### Aktuellen DNS-Status prüfen:

```bash
# CNAME prüfen
dig kurs.prostarmarketing.de CNAME +short

# A-Records prüfen (nach CNAME-Auflösung)
dig kurs.prostarmarketing.de A +short

# Vollständige DNS-Info
dig kurs.prostarmarketing.de ANY +noall +answer
```

### HTTP/HTTPS testen:

```bash
# HTTPS-Zugriff testen
curl -I https://kurs.prostarmarketing.de

# Server-Header prüfen
curl -v https://kurs.prostarmarketing.de 2>&1 | grep -i server

# SSL-Zertifikat prüfen
openssl s_client -connect kurs.prostarmarketing.de:443 -servername kurs.prostarmarketing.de < /dev/null 2>&1 | grep -A5 "subject="
```

---

## 📋 CHECKLISTE

Bevor du DNS änderst:

- [ ] Railway ist deployed (Status: grün)
- [ ] Railway URL notiert (z.B. `prostar-xyz.up.railway.app`)
- [ ] Zugriff auf Google Domains ODER Squarespace
- [ ] Backup: Alte CNAME-URL notiert (`ext-sq.squarespace.com`)

Nach DNS-Änderung:

- [ ] 30 Min gewartet
- [ ] DNS propagiert (`dig kurs.prostarmarketing.de CNAME +short`)
- [ ] Custom Domain in Railway hinzugefügt
- [ ] SSL aktiv (grünes Schloss in Railway)
- [ ] https://kurs.prostarmarketing.de lädt Landing Page

---

## 🆘 HÄUFIGE PROBLEME

### Problem 1: "Ich finde meine Railway URL nicht"

**Lösung**:

```
Railway Dashboard → Dein Projekt → Deployments
→ Aktuelles Deployment anklicken
→ Rechts oben: "Settings"
→ "Domains"
→ Siehst du "Generated Domain": xyz.up.railway.app
```

Falls KEINE Domain angezeigt wird:
```
→ Klicke "Generate Domain"
→ Railway erstellt automatisch: prostar-production-xyz.up.railway.app
```

### Problem 2: "Google Domains zeigt keinen CNAME-Eintrag"

**Möglichkeit 1**: DNS wird bei Squarespace verwaltet

**Prüfen**:
```
1. Google Domains → prostarmarketing.de
2. Sieh nach: "Name servers" (Nameserver)
3. Steht dort:
   - ns-cloud-a1.googledomains.com → DNS bei Google
   - ns1.squarespace.com → DNS bei Squarespace
```

**Möglichkeit 2**: CNAME existiert nicht

```
→ Google Domains → prostarmarketing.de → DNS
→ "Custom resource records"
→ Klicke "Add" (Hinzufügen)
→ Erstelle NEUEN CNAME:
   Name: kurs
   Type: CNAME
   Data: prostar-xyz.up.railway.app
```

### Problem 3: "DNS ändert sich nicht"

**Häufigste Ursache**: DNS-Cache

**Lösung**:

```bash
# macOS:
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Linux:
sudo systemd-resolve --flush-caches

# Windows:
ipconfig /flushdns
```

**Warte dann 30-60 Min und prüfe erneut**.

### Problem 4: "Railway zeigt SSL-Fehler"

**Symptom**: Nach Custom Domain hinzufügen zeigt Railway roten Fehler

**Ursache**: DNS zeigt noch nicht auf Railway

**Lösung**:

```
1. Prüfe DNS:
   dig kurs.prostarmarketing.de CNAME +short
   
2. Sollte Railway-Domain zeigen!
   
3. Falls nicht:
   - Warte länger (bis zu 60 Min)
   - Prüfe DNS-Einstellungen nochmal
   - Railway Domain entfernen und neu hinzufügen
```

---

## 🎯 QUICK START

```bash
# 1. Railway URL herausfinden
railway.app → Dein Projekt → Settings → Domains
→ Notiere: prostar-xyz.up.railway.app

# 2. DNS CNAME ändern
domains.google.com → prostarmarketing.de → DNS
→ CNAME: kurs → prostar-xyz.up.railway.app

# 3. Warten (30 Min)
dig kurs.prostarmarketing.de CNAME +short

# 4. Custom Domain in Railway
railway.app → Settings → Domains → Add Custom Domain
→ kurs.prostarmarketing.de

# 5. Testen
curl -I https://kurs.prostarmarketing.de
→ Sollte: HTTP/2 200 (NICHT 301!)
```

---

**SAG MIR:**

1. **Deine Railway URL** (prostar-xyz.up.railway.app)
2. **Wo verwaltest du DNS?** (Google Domains oder Squarespace)

Dann gebe ich dir die **exakten Klick-für-Klick-Schritte**! 🚀
