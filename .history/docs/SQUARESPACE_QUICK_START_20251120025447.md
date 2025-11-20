# Squarespace Quick Start

## Status: PRODUKTIONSBEREIT

Deine Landing Page ist fertig gebaut. Squarespace ist der einfachste Weg, um live zu gehen!

---

## 5-Minuten Checklist

### Schritt 1: Squarespace Konto (2 Min)

1. Gehe zu: squarespace.com
2. Klick: "Website erstellen"
3. Wähle: "Business" Template
4. E-Mail & Passwort eingeben

### Schritt 2: Domain verbinden (2 Min)

Du hast 2 Optionen:

#### Option A: Bei Squarespace kaufen (Einfacher)

1. Settings → Domains → "+ Add domain"
2. Gib ein: prostarmarketing.de
3. Preis: etwa 12 Euro/Jahr
4. Klick: "Checkout"

#### Option B: Externe Domain verbinden

1. Settings → Domains → "+ Add domain"
2. Wähle: "Connect external domain"
3. Gib ein: prostarmarketing.de
4. Kopiere Nameserver
5. Gehe zu deinem Registrar (1&1, Ionos, etc.)
6. Ersetze Nameserver
7. Warte 24-48 Stunden

### Schritt 3: Landing Page hochladen (1 Min)

Terminal (lokal):

```bash
cd "/Users/user/Downloads/prostar_landing_page (1)"
pnpm build
```

In Squarespace:

1. Gehe zu: Pages → "+" → "Add blank page"
2. Name: "Home"
3. Klick: "+" → "Code Block"
4. Kopiere Inhalt aus: dist/public/index.html
5. Paste in Code Block
6. Klick: "Publish"

FERTIG!

---

## Deine Neue URL

```
https://prostarmarketing.de
```

Läuft jetzt!

---

## Optional: Chat Widget + Google Analytics

### Chat Widget (5 Min)

1. Gehe zu: Pages → beliebige Seite
2. Klick: "+" → "Code Block"
3. Kopiere diesen Code:

```html
<script>
  (function() {
    function initChat() {
      const chatContainer = document.createElement('div');
      chatContainer.id = 'prostar-chat-widget';
      chatContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
      `;
      document.body.appendChild(chatContainer);
      
      const script = document.createElement('script');
      script.src = 'https://your-api-url.com/chat-widget.js';
      script.async = true;
      document.head.appendChild(script);
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initChat);
    } else {
      initChat();
    }
  })();
</script>
```

4. Ersetze: your-api-url.com mit echter URL
5. Klick: "Save" → "Publish"

### Google Analytics (5 Min)

1. Gehe zu: google.com/analytics
2. Erstelle neues Konto
3. Domain: prostarmarketing.de
4. Kopiere Tracking-ID (G-XXXX)
5. In Squarespace: Settings → Website → Analytics
6. Paste Tracking-ID
7. Save & Publish

---

## Testen

1. Öffne: https://prostarmarketing.de
2. Prüfe:
   - Seite lädt schnell?
   - Responsive (Mobile ok)?
   - Chat Widget sichtbar?
   - HTTPS (padlock icon)?

---

## Support

Problem? Siehe: `docs/SQUARESPACE_DEPLOYMENT_GUIDE.md`

Schnelle Hilfe:

- Squarespace: https://support.squarespace.com (24/7)
- ProStar Team: support@prostarmarketing.de

---

## Kosten

| Was | Kosten |
|-----|--------|
| Squarespace Plan | 15-30 Euro/Mo |
| Domain (.de) | 1 Euro/Mo |
| SSL Zertifikat | 0 Euro |
| Email Support | 0 Euro |
| TOTAL | 16-31 Euro/Mo |

---

## Du bist fertig

Herzlichen Glückwunsch!

Deine ProStar Landing Page läuft jetzt auf Squarespace unter prostarmarketing.de!

Was jetzt?

1. Besuche: https://prostarmarketing.de
2. Teile mit deinem Team
3. Starte Marketing
4. Tracke Besucher via Analytics

Viel Erfolg!
