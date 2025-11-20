# ProStar Landing Page auf Squarespace - Deployment Guide

**Status:** 🟢 Produktionsbereit  
**Zielgruppe:** Entwickler & Nicht-technische Nutzer  
**Sprache:** Deutsch  
**Version:** 1.0.0 | **Datum:** 20.11.2025

---

## 📋 Inhaltsverzeichnis

1. Übersicht
2. Squarespace Domain Setup
3. Landing Page hochladen
4. Chat Widget integrieren
5. SSL/Sicherheit
6. Analytics & Tracking
7. Testen & Validierung
8. Troubleshooting
9. Support

---

## 1. Übersicht

### ✅ Warum Squarespace?

| Aspekt | Vorteil |
|--------|---------|
| **Einfachheit** | Keine technischen Grundkenntnisse nötig |
| **Sicherheit** | SSL, Backups, Updates automatisch |
| **Domain** | Einfache Domain-Integration (prostarmarketing.de) |
| **Kosten** | $15-30/Mo (all-in-one) |
| **Zuverlässigkeit** | 99.9% Uptime SLA |
| **Support** | 24/7 deutscher Support verfügbar |

### 🎯 Deine aktuelle Situation

- ✅ React Landing Page gebaut (in `client/`)
- ✅ Vite Production Build bereit (`pnpm build`)
- ✅ Domain: prostarmarketing.de verfügbar
- ✅ Chat Widget entwickelt
- ✅ Google Analytics konfiguriert

### 📊 Migration Path

```
React Landing Page (Vite)
         ↓
      Build
         ↓
   dist/public/ Dateien
         ↓
   Squarespace Website Builder
         ↓
   prostarmarketing.de (Live)
```

---

## 2. Squarespace Domain Setup

### Schritt 1: Squarespace Konto erstellen

1. Gehe zu **squarespace.com**
2. Klick auf **"Website erstellen"**
3. Wähle Template: **"Blank Canvas"** oder **"Business"**
4. Fülle Grunddaten aus (E-Mail, Passwort)

### Schritt 2: Domain hinzufügen (prostarmarketing.de)

**Option A: Neue Domain bei Squarespace kaufen**
```
1. Gehe zu: Settings → Domains
2. Klick: "+ Add domain"
3. Gib ein: prostarmarketing.de
4. Preis: ~€12/Jahr (.de Domain)
5. Checkout → Bezahlen
```

**Option B: Externe Domain verbinden**
```
1. Gehe zu: Settings → Domains
2. Klick: "+ Add domain"
3. Wähle: "Connect external domain"
4. Gib ein: prostarmarketing.de
5. Kopiere Nameserver von Squarespace
6. Gehe zu deinem Registrar (1&1, Ionos, etc.)
7. Ersetze Nameserver
8. Warte 24-48h auf Propagation
```

**Nameserver-Beispiel (Squarespace):**
```
ns1.squarespace.com
ns2.squarespace.com
ns3.squarespace.com
ns4.squarespace.com
```

### Schritt 3: SSL/TLS Zertifikat (automatisch)

```
✅ Squarespace aktiviert automatisch SSL
✅ HTTPS://prostarmarketing.de funktioniert sofort
✅ Kostenlos enthalten
```

---

## 3. Landing Page hochladen

### Option 1: React Landing Page als HTML/CSS/JS (Empfohlen)

**Schritt A: Production Build erstellen**

```bash
cd "/Users/user/Downloads/prostar_landing_page (1)"
pnpm build
```

**Ergebnis:** Dateien in `dist/public/`

```
dist/public/
├── index.html          ← WICHTIG
├── assets/
│   ├── index.xxxxx.js
│   ├── index.xxxxx.css
│   └── ...
├── images/
└── favicon.ico
```

**Schritt B: In Squarespace hochladen**

```
1. Gehe zu: Website Editor → Pages
2. Erstelle neue Seite: "Home"
3. Klick auf: "+"
4. Füge "Code Block" hinzu
5. Wähle: "Full Width"
6. Paste HTML-Inhalt von dist/public/index.html
7. Publish
```

**⚠️ WICHTIG:** Nur `<body>` Inhalt kopieren!

**Schritt C: Assets hochladen**

```
1. Gehe zu: Settings → Asset Library
2. Klick: Upload
3. Lade Dateien hoch von dist/public/assets/
   - Alle .js Dateien
   - Alle .css Dateien
   - Alle Bilder
```

### Option 2: Squarespace Native Design (Alternative)

Wenn React-Integration zu komplex ist:

```
1. Squarespace Template verwenden
2. Inhalte manuell einfügen
3. Chat Widget als Code Block
4. Deutlich einfacher zu maintainen
```

---

## 4. Chat Widget integrieren

### Schritt 1: Code Block in Squarespace

```
1. Gehe zu Website → Pages → Wähle beliebige Seite
2. Klick: "+"
3. Suche: "Code"
4. Wähle: "Code Block"
```

### Schritt 2: Chat Widget Code einfügen

**Kopiere diesen Code:**

```html
<script>
  (function() {
    // ProStar AI Chat Widget für Squarespace
    
    // Warten bis DOM ready
    function initChat() {
      // Chat Container erstellen
      const chatContainer = document.createElement('div');
      chatContainer.id = 'prostar-chat-widget';
      chatContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;
      
      document.body.appendChild(chatContainer);
      
      // Widget Script laden (ÄNDERN SIE DIE URL!)
      const script = document.createElement('script');
      script.src = 'https://your-api-domain.com/prostar-chat-widget.js';
      script.async = true;
      script.onload = function() {
        if (window.ProstarChat) {
          window.ProstarChat.init({
            containerId: 'prostar-chat-widget',
            apiUrl: 'https://your-api-domain.com/api',
            theme: 'light',  // oder 'dark'
            position: 'bottom-right'
          });
        }
      };
      document.head.appendChild(script);
    }
    
    // DOM-Ready Handler
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChat);
    } else {
      initChat();
    }
  })();
</script>
```

**👉 WICHTIG:** Ersetze `your-api-domain.com` mit deiner echten API URL!

### Schritt 3: Speichern & Testen

```
1. Klick: "Save"
2. Gehe zu Website Preview (oben rechts)
3. Prüfe: Chat Widget sichtbar unten rechts?
4. Teste: Chat funktioniert?
5. Publish
```

---

## 5. SSL/Sicherheit

### ✅ Automatisch durch Squarespace

| Sicherheit | Status |
|-----------|--------|
| **HTTPS** | ✅ Automatisch aktiviert |
| **SSL Zertifikat** | ✅ Kostenlos Let's Encrypt |
| **Firewall** | ✅ DDoS Protection enthalten |
| **Backups** | ✅ Täglich automatisch |
| **Updates** | ✅ Automatisch |

### 🔒 Zusätzliche Sicherheit

**1. Starkes Passwort setzen**
```
Settings → Account → Password
Nutze: 16+ Zeichen, Großbuchstaben, Zahlen, Symbole
```

**2. Two-Factor Authentication aktivieren**
```
Settings → Account → Two-Factor Authentication
Klick: Enable
```

**3. Regelmäßig Backups exportieren**
```
Settings → Export
Lade Inhalt monatlich herunter
```

---

## 6. Analytics & Tracking

### Google Analytics integrieren

**Schritt 1: Google Analytics Konto**
```
1. Gehe zu: google.com/analytics
2. Klick: "Konto erstellen"
3. Domain: prostarmarketing.de
4. Kopiere: Tracking-ID (G-XXXXXXXXXX)
```

**Schritt 2: In Squarespace integrieren**
```
1. Gehe zu: Settings → Website
2. Suche: "Analytics"
3. Wähle: "Google Analytics"
4. Paste Tracking-ID: G-XXXXXXXXXX
5. Save
```

**Schritt 3: Testen**
```
1. Öffne prostarmarketing.de im Incognito-Modus
2. Gehe zu Google Analytics → Realtime
3. Prüfe: Siehst du deinen Besuch?
```

### Chat-Konversionen tracken

**Code für Analytics Events:**

```html
<script>
  // Im Chat Widget erfolgreich abgeschlossene Konversation
  window.trackChatEvent = function(eventName, data) {
    if (window.gtag) {
      gtag('event', eventName, {
        'event_category': 'chat',
        'event_label': data.topic || 'general',
        'value': data.duration || 0
      });
    }
  };
  
  // Beispiel aufrufen:
  // window.trackChatEvent('chat_completed', {
  //   topic: 'pricing',
  //   duration: 120
  // });
</script>
```

---

## 7. Testen & Validierung

### ✅ Launch Checkliste

**Technisch:**
- [ ] Domain prostarmarketing.de zeigt auf Squarespace
- [ ] HTTPS funktioniert (padlock icon)
- [ ] Landing Page vollständig sichtbar
- [ ] Responsive Design (Mobile/Tablet/Desktop)
- [ ] Chat Widget sichtbar und funktioniert
- [ ] Google Analytics funktioniert
- [ ] Alle Links funktionieren
- [ ] Keine 404 Fehler in Browser Console (F12)

**Inhalt:**
- [ ] Text korrekt Deutsch
- [ ] Bilder laden schnell
- [ ] CTA-Buttons funktionieren
- [ ] Formular funktioniert (falls vorhanden)
- [ ] E-Mail-Benachrichtigungen funktionieren

**Sicherheit:**
- [ ] SSL-Zertifikat gültig
- [ ] Keine gemischten Content-Warnungen
- [ ] Passwort stark
- [ ] Two-Factor Auth aktiv
- [ ] Backups vorhanden

### Performance testen

**Google PageSpeed Insights:**
```
1. Gehe zu: pagespeed.web.dev
2. Gib ein: prostarmarketing.de
3. Prüfe: Score sollte > 80 sein
4. Behebe Warnings
```

**Responsiveness testen:**
```
Browser Konsole (F12) → Ctrl+Shift+M
Teste auf:
  - iPhone 12
  - iPad
  - Desktop 1920x1080
```

---

## 8. Troubleshooting

### Problem: Domain zeigt alte Website

**Ursache:** DNS Propagation nicht abgeschlossen

**Lösung:**
```
1. Warte 24-48 Stunden
2. Leere Browser Cache (Ctrl+Shift+Del)
3. Prüfe DNS mit: https://dns.google
4. Query: prostarmarketing.de → Sollte auf Squarespace verweisen
```

### Problem: Chat Widget wird nicht angezeigt

**Ursache 1: Falscher Code**
```
✅ Lösung: Script-URL überprüfen
- Ersetze your-api-domain.com mit echter URL
- Teste in Browser Console: console.log(window.ProstarChat)
```

**Ursache 2: CORS Fehler**
```
✅ Lösung: API CORS Headers konfigurieren
Server muss folgende Header setzen:
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST
```

**Ursache 3: Script blockiert**
```
✅ Lösung: Squarespace-Code-Block statt Custom Embed nutzen
- Funktioniert besser mit Squarespace Security
```

### Problem: Langsame Seite

**Ursache:** Große Bilder/Assets

**Lösung:**
```
1. Komprimiere Bilder (tinypng.com)
2. Nutze WebP Format
3. Lazy Loading aktivieren
4. Reduziere 3rd-party Scripts
```

### Problem: E-Mails werden nicht zugestellt

**Ursache:** SPF/DKIM nicht konfiguriert

**Lösung:**
```
Settings → Email → Sender Address
Folge Squarespace Anleitung für SPF Records
```

---

## 9. Maintenance & Updates

### Wöchentlich

- [ ] Analytics prüfen (Besucher, Konversionen)
- [ ] Chat Widget funktioniert?
- [ ] Keine Fehler-E-Mails?

### Monatlich

- [ ] Backup exportieren
- [ ] SSL Zertifikat Status prüfen
- [ ] Performance überprüfen
- [ ] Content updaten

### Jährlich

- [ ] Domain verlängern
- [ ] Squarespace Plan überprüfen
- [ ] Sicherheits-Audit
- [ ] A/B Tests auswerten

---

## 10. Support & Ressourcen

### Squarespace Support

| Kanal | Verfügbarkeit | Sprache |
|-------|----------------|---------|
| **Chat** | 24/7 | Deutsch/English |
| **Email** | 24h Response | Deutsch/English |
| **Telefon** | Mo-Fr 9-18 Uhr | Deutsch |
| **Community** | 24/7 | English |

**Link:** https://support.squarespace.com/hc/en-us

### ProStar Support

**Fragen zum Chat Widget?**
- Kontakt: support@prostarmarketing.de
- Response Zeit: 24-48 Stunden

**Technische Fragen zur Landing Page?**
- Kontakt: dev@prostarmarketing.de

---

## 11. Next Steps

### 🚀 Sofort (Heute)

1. [ ] Squarespace Konto erstellen
2. [ ] Domain verbinden (prostarmarketing.de)
3. [ ] Production Build lokal testen: `pnpm build`

### ⚡ Diese Woche

1. [ ] Landing Page hochladen
2. [ ] Chat Widget integrieren
3. [ ] Google Analytics konfigurieren
4. [ ] Vollständiges Testen

### 📊 Diese Woche (Vor Launch)

1. [ ] Performance Optimieren
2. [ ] SEO konfigurieren
3. [ ] Backup erstellen
4. [ ] Final Prüfung

### 🎯 Nach Launch

1. [ ] Analytics Monitoring
2. [ ] Besucher tracking
3. [ ] Chat Konversationen analysieren
4. [ ] Kontinuierliche Optimierung

---

## 12. Kosten Übersicht

| Posten | Kosten/Monat | Kosten/Jahr |
|--------|-------------|-----------|
| **Squarespace Plan** | €15-30 | €180-360 |
| **Domain** (.de) | €1 | €12 |
| **SSL Zertifikat** | €0 | €0 ✅ |
| **Email Support** | €0 | €0 ✅ |
| **Backups** | €0 | €0 ✅ |
| **Analytics** | €0 | €0 ✅ |
| **TOTAL** | **€16-31** | **€192-372** |

**Vs. Azure:**
- Azure B1 Plan: €15-20/Mo
- Aber: Technische Komplexität, mehr Maintenance nötig

---

## ✅ Abschluss

Du hast jetzt alles für Squarespace:

1. ✅ React Landing Page bereit
2. ✅ Production Build optimiert
3. ✅ Chat Widget entwickelt
4. ✅ Analytics konfiguriert
5. ✅ Klare Anleitung zur Veröffentlichung

**Nächster Schritt:** Squarespace Konto erstellen und los geht's! 🎉

---

**Version:** 1.0.0  
**Zuletzt aktualisiert:** 20. November 2025  
**Sprache:** Deutsch  
**Zielgruppe:** Entwickler & Nicht-technische Nutzer
