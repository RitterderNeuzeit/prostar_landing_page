# ProStar Chat Widget - Embedding Guide

## Übersicht

Das ProStar Chat Widget ist eine **portable, wiederverwendbare Komponente**, die auf jeder Website eingebunden werden kann. Das Widget kommuniziert mit einer zentralen Datenbank und bietet eine konsistente Benutzerfahrung auf allen Plattformen.

## Features

- ✓ **Portable Komponente** - Einfach auf jeder Website einbindbar
- ✓ **Responsive Design** - Optimiert für Mobile, Tablet, Desktop
- ✓ **Datenbank-Integration** - Zentrale Verwaltung aller Chat-Daten
- ✓ **ProStar Branding** - Neon-Cyan Design, Dark Theme
- ✓ **Offline-Funktionalität** - Chat-Verlauf in localStorage
- ✓ **Leichte Integration** - Nur 2 Zeilen Code erforderlich

## Installation auf Ihrer Hauptseite

### Option 1: Einfache Einbindung (Empfohlen)

Fügen Sie diese zwei Zeilen in den `<head>` oder vor dem `</body>` Tag Ihrer HTML-Seite ein:

```html
<!-- ProStar Chat Widget -->
<script src="https://prostarai.manus.space/prostar-chat-widget.js"></script>
<script>
  ProStarChat.init({
    apiUrl: "https://prostarai.manus.space/api",
    position: "bottom-right",
    theme: "dark",
    title: "ProStar Chat Assistant",
  });
</script>
```

### Option 2: Mit benutzerdefinierten Optionen

```html
<script src="https://prostarai.manus.space/prostar-chat-widget.js"></script>
<script>
  ProStarChat.init({
    apiUrl: "https://prostarai.manus.space/api",
    position: "bottom-left", // oder 'bottom-right'
    theme: "dark", // oder 'light'
    title: "Fragen zum Kurs?",
    placeholder: "Ihre Frage...",
    initialMessage: "Hallo! Wie kann ich Ihnen helfen?",
  });
</script>
```

## Konfigurationsoptionen

| Option           | Typ    | Standard                                     | Beschreibung                                         |
| ---------------- | ------ | -------------------------------------------- | ---------------------------------------------------- |
| `apiUrl`         | String | `https://prostarai.manus.space/api`          | API-Endpoint für Chat-Requests                       |
| `position`       | String | `bottom-right`                               | Position des Widgets (`bottom-right`, `bottom-left`) |
| `theme`          | String | `dark`                                       | Design-Theme (`dark`, `light`)                       |
| `title`          | String | `ProStar Chat Assistant`                     | Titel im Chat-Header                                 |
| `placeholder`    | String | `Stellen Sie eine Frage...`                  | Platzhalter im Input-Feld                            |
| `initialMessage` | String | `Hallo! 👋 Wie kann ich Ihnen heute helfen?` | Erste Nachricht vom Bot                              |

## Verwendungsbeispiele

### Beispiel 1: Auf WordPress-Website

Fügen Sie den Code in den **Theme Footer** oder über ein **Code-Snippet Plugin** ein:

```html
<!-- In wp-content/themes/your-theme/footer.php oder via Code Snippets Plugin -->
<script src="https://prostarai.manus.space/prostar-chat-widget.js"></script>
<script>
  ProStarChat.init({
    position: "bottom-right",
    title: "ProStar Support",
  });
</script>
```

### Beispiel 2: Auf Squarespace-Website

1. Gehen Sie zu **Settings → Advanced → Code Injection**
2. Fügen Sie den Code in **Footer** ein:

```html
<script src="https://prostarai.manus.space/prostar-chat-widget.js"></script>
<script>
  ProStarChat.init({
    position: "bottom-right",
  });
</script>
```

### Beispiel 3: Auf Wix-Website

1. Gehen Sie zu **Settings → Custom Code**
2. Wählen Sie **Add Custom Code**
3. Fügen Sie den Code ein und wählen Sie **Footer** als Position

```html
<script src="https://prostarai.manus.space/prostar-chat-widget.js"></script>
<script>
  ProStarChat.init({
    position: "bottom-right",
  });
</script>
```

### Beispiel 4: Auf Shopify-Store

1. Gehen Sie zu **Online Store → Themes**
2. Klicken Sie auf **Edit code**
3. Öffnen Sie `theme.liquid`
4. Fügen Sie vor `</body>` ein:

```html
<script src="https://prostarai.manus.space/prostar-chat-widget.js"></script>
<script>
  ProStarChat.init({
    position: "bottom-right",
    title: "Shop Support",
  });
</script>
```

## JavaScript API

Sie können das Widget auch programmatisch steuern:

```javascript
// Chat öffnen
ProStarChat.openChat();

// Chat schließen
ProStarChat.closeChat();

// Chat umschalten
ProStarChat.toggleChat();

// Nachricht hinzufügen
ProStarChat.addMessage("Hallo!", "user");

// Chat-Verlauf löschen
localStorage.removeItem("prostarChatHistory");
```

## Datenbank-Integration

Das Widget speichert Daten an folgenden Orten:

### Lokal (im Browser)

- **localStorage**: Chat-Verlauf (`prostarChatHistory`)
- **sessionStorage**: Temporäre Sitzungsdaten

### Zentral (auf dem Server)

- **Datenbank**: Alle Chat-Nachrichten und Benutzer-Interaktionen
- **API-Endpoints**: `/api/chat/send`, `/api/chat/history`

## CORS-Konfiguration

Damit das Widget auf verschiedenen Domains funktioniert, müssen CORS-Header konfiguriert sein:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

Diese sind bereits in der API konfiguriert.

## Styling & Anpassung

Das Widget verwendet CSS-Variablen für einfache Anpassungen:

```html
<script>
  // Vor dem Init-Aufruf
  document.documentElement.style.setProperty("--prostar-primary", "#00D9FF");
  document.documentElement.style.setProperty("--prostar-secondary", "#0A0E27");

  ProStarChat.init();
</script>
```

## Troubleshooting

### Problem: Widget wird nicht angezeigt

**Lösung:**

1. Überprüfen Sie die Browser-Konsole auf Fehler (F12)
2. Stellen Sie sicher, dass das Script vollständig geladen ist
3. Überprüfen Sie, dass `ProStarChat` global verfügbar ist

```javascript
console.log(window.ProStarChat); // Sollte das Widget-Objekt anzeigen
```

### Problem: Chat-Nachrichten werden nicht gesendet

**Lösung:**

1. Überprüfen Sie die API-URL in der Konfiguration
2. Überprüfen Sie die Browser-Konsole auf CORS-Fehler
3. Stellen Sie sicher, dass die API erreichbar ist

```javascript
fetch("https://prostarai.manus.space/api/chat/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Test" }),
});
```

### Problem: Widget lädt langsam

**Lösung:**

1. Verwenden Sie `async` oder `defer` beim Script-Tag:

```html
<script
  src="https://prostarai.manus.space/prostar-chat-widget.js"
  defer
></script>
```

2. Laden Sie das Script am Ende der Seite statt im Header

## Performance-Tipps

1. **Lazy Loading**: Laden Sie das Widget nur bei Bedarf
2. **Caching**: Browser-Caching ist aktiviert
3. **CDN**: Das Widget wird über CDN bereitgestellt
4. **Kompression**: Gzip-Kompression ist aktiviert

## Sicherheit

- ✓ HTTPS-Verbindung erforderlich
- ✓ CORS-Validierung aktiv
- ✓ Input-Sanitization implementiert
- ✓ Rate-Limiting für API-Requests
- ✓ Benutzer-Daten verschlüsselt

## Support & Updates

Für Fragen oder Probleme:

- Email: support@prostarmarketing.de
- Chat: Verwenden Sie das Widget selbst!
- Dokumentation: https://prostarai.manus.space/docs

## Changelog

### Version 1.0 (Aktuell)

- Initial Release
- Basis-Chat-Funktionalität
- Responsive Design
- localStorage-Integration

### Geplante Features

- Video-Support
- File-Upload
- Chatbot-Analytics
- Multi-Language-Support
- Webhook-Integration
