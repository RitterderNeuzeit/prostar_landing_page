# ProStar AI Chat Widget - Squarespace Integration Guide

## Problem
Der Chat-Widget wird auf prostarmarketing.de (Squarespace) nicht angezeigt, obwohl der Embed-Code hinzugefügt wurde.

## Ursachen
1. **Squarespace blockiert externe Scripts** - Sicherheitsrichtlinien können externe JavaScript blockieren
2. **Falscher Platzierungsort** - Der Code wurde möglicherweise nicht am richtigen Ort eingefügt
3. **CORS-Probleme** - Cross-Origin Resource Sharing nicht korrekt konfiguriert
4. **Code Injection Timing** - Der Code wird vor dem DOM-Ready ausgeführt

## Lösungen für Squarespace

### Lösung 1: Code Block in Squarespace hinzufügen (Empfohlen)

1. **Melden Sie sich in Squarespace an** → Website bearbeiten
2. **Gehen Sie zur Seite**, wo der Chat angezeigt werden soll (z.B. Footer oder jede Seite)
3. **Klicken Sie auf "+"** → Suchen Sie nach "Code" Block
4. **Wählen Sie "Code Block"** aus
5. **Fügen Sie folgenden Code ein:**

```html
<script>
  // ProStar AI Chat Widget für Squarespace
  (function() {
    // Warten bis DOM ready ist
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initProstarChat);
    } else {
      initProstarChat();
    }
    
    function initProstarChat() {
      // Chat Widget Container erstellen
      const chatContainer = document.createElement('div');
      chatContainer.id = 'prostar-chat-widget';
      chatContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      `;
      
      document.body.appendChild(chatContainer);
      
      // Chat Widget Script laden
      const script = document.createElement('script');
      script.src = 'https://prostarai.manus.space/prostar-chat-widget.js';
      script.async = true;
      script.onload = function() {
        // Widget initialisieren
        if (window.ProstarChat) {
          window.ProstarChat.init({
            containerId: 'prostar-chat-widget',
            apiUrl: 'https://prostarai.manus.space/api',
            theme: 'dark',
            position: 'bottom-right'
          });
        }
      };
      document.head.appendChild(script);
    }
  })();
</script>
```

6. **Speichern Sie die Änderungen**
7. **Veröffentlichen Sie die Website**

### Lösung 2: Custom CSS/Code in Squarespace Settings

1. **Gehen Sie zu Settings** → **Advanced** → **Code Injection**
2. **Wählen Sie "Footer"** (um den Code auf allen Seiten zu laden)
3. **Fügen Sie folgenden Code ein:**

```html
<script>
  (function() {
    // ProStar AI Chat Widget - Squarespace Footer Injection
    window.addEventListener('load', function() {
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
      script.src = 'https://prostarai.manus.space/prostar-chat-widget.js';
      script.async = true;
      document.head.appendChild(script);
    });
  })();
</script>
```

4. **Speichern Sie die Einstellungen**
5. **Veröffentlichen Sie die Website**

### Lösung 3: Iframe-basierte Integration (Fallback)

Falls externe Scripts blockiert werden, verwenden Sie eine Iframe-basierte Lösung:

```html
<div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;">
  <iframe 
    src="https://prostarai.manus.space/chat-widget.html" 
    style="width: 400px; height: 600px; border: none; border-radius: 12px; box-shadow: 0 5px 40px rgba(0, 0, 0, 0.3);"
    allow="camera; microphone"
  ></iframe>
</div>
```

## Troubleshooting

### Chat Widget wird nicht angezeigt

**Schritt 1: Browser Console überprüfen**
- Öffnen Sie prostarmarketing.de
- Drücken Sie **F12** → **Console**
- Suchen Sie nach Fehlermeldungen
- Häufige Fehler:
  - `CORS error` → API-Endpoint nicht erreichbar
  - `Script blocked` → Squarespace blockiert das Script
  - `undefined is not a function` → Widget Script nicht geladen

**Schritt 2: CORS-Konfiguration überprüfen**
- Stellen Sie sicher, dass der API-Endpoint CORS-Header setzt:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**Schritt 3: Script-Quellen überprüfen**
- Öffnen Sie **Network Tab** in DevTools
- Suchen Sie nach `prostar-chat-widget.js`
- Überprüfen Sie, ob die Datei mit Status 200 geladen wird

### Chat Widget lädt, aber funktioniert nicht

1. **Überprüfen Sie die API-Verbindung:**
   - Network Tab → Filter nach "api"
   - Suchen Sie nach Requests zu `/api/chat`
   - Überprüfen Sie Response Status (sollte 200 sein)

2. **Überprüfen Sie die System Prompt:**
   - Stellen Sie sicher, dass die ProStar Brand Voice korrekt konfiguriert ist
   - Testen Sie mit einer einfachen Frage

3. **Überprüfen Sie localStorage:**
   - Öffnen Sie DevTools → Application → LocalStorage
   - Suchen Sie nach `prostar_chat_history`
   - Überprüfen Sie, ob Chat-Nachrichten gespeichert werden

## Testing-Checkliste

- [ ] Chat Widget ist sichtbar auf prostarmarketing.de
- [ ] Chat Bubble kann geklickt werden (öffnet/schließt)
- [ ] Nachricht kann eingegeben und gesendet werden
- [ ] Bot antwortet mit ProStar Brand Voice
- [ ] Chat-Verlauf wird in localStorage gespeichert
- [ ] Widget funktioniert auf Mobile/Tablet/Desktop
- [ ] Keine JavaScript-Fehler in der Console
- [ ] API-Requests sind erfolgreich (Status 200)
- [ ] CORS-Header sind korrekt gesetzt

## Support

Bei Problemen:
1. Überprüfen Sie die Browser Console (F12)
2. Überprüfen Sie die Network Tab
3. Stellen Sie sicher, dass die API-Endpoints erreichbar sind
4. Testen Sie mit einem anderen Browser

---

**Nächste Schritte:**
1. Wählen Sie die beste Integrationsmethode für Ihr Setup
2. Implementieren Sie den Code
3. Testen Sie die Funktionalität
4. Überwachen Sie die Chat-Metriken
