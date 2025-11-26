# ProStar AI Chat Bubble - Squarespace Setup (Optimiert)

## Überblick

Der **ProStar AI Chat Bubble** ist ein leichtgewichtiger, nicht-intrusiver Chat-Agent speziell für Squarespace optimiert. Im Gegensatz zum großen Iframe ist dies eine kleine, elegante Bubble unten rechts auf der Seite.

## Features

✓ **Kleine Bubble** - Nur 60px Durchmesser, nimmt wenig Platz weg
✓ **Neon-Cyan Design** - Passt perfekt zu ProStar Brand Colors
✓ **Responsive** - Funktioniert auf Mobile, Tablet, Desktop
✓ **Keine Überlagerung** - Überlagert nicht die Seite
✓ **ProStar Brand Voice** - Antwortet mit optimierter Persönlichkeit
✓ **Chat-Verlauf** - Speichert Nachrichten in localStorage
✓ **Offline-Ready** - Funktioniert auch ohne API-Verbindung

## Installation in Squarespace

### Schritt 1: Öffnen Sie Squarespace Settings

1. Melden Sie sich in Squarespace an
2. Gehen Sie zu **Settings** (Zahnrad-Icon)
3. Wählen Sie **Advanced** aus der linken Sidebar
4. Klicken Sie auf **Code Injection**

### Schritt 2: Code in Footer einfügen

1. Klicken Sie auf **Footer** Tab
2. Kopieren Sie folgenden Code:

```html
<!-- ProStar AI Chat Bubble -->
<script src="https://prostarai.manus.space/prostar-chat-bubble.js"></script>
<script>
  // Chat Bubble initialisieren
  ProstarChatBubble.init({
    apiUrl: "https://prostarai.manus.space/api",
    position: "bottom-right",
    theme: "dark",
  });
</script>
```

3. **Fügen Sie den Code in das Footer-Feld ein**
4. Klicken Sie auf **Save**

### Schritt 3: Veröffentlichen

1. Gehen Sie zurück zu Ihrer Website
2. Klicken Sie auf **Publish** (oben rechts)
3. Warten Sie, bis die Änderungen live sind

## Überprüfung

Nach dem Veröffentlichen sollten Sie:

✓ **Kleine Neon-Cyan Bubble** unten rechts sehen
✓ **Bubble kann geklickt werden** - öffnet Chat-Fenster
✓ **Chat-Fenster ist elegant und responsive**
✓ **Nachrichten können eingegeben und gesendet werden**
✓ **Bot antwortet mit ProStar Brand Voice**

## Anpassungen

### Position ändern

Wenn Sie die Bubble an einer anderen Position möchten, ändern Sie die CSS:

```javascript
ProstarChatBubble.init({
  position: "bottom-left", // oder 'top-right', 'top-left'
  // ... andere Optionen
});
```

### Farbe anpassen

```javascript
ProstarChatBubble.init({
  bubbleColor: "#FF6B6B", // Andere Farbe
  bubbleGlow: "0 0 20px rgba(255, 107, 107, 0.6)",
  // ... andere Optionen
});
```

### Größe ändern

```javascript
ProstarChatBubble.init({
  bubbleSize: 80, // Größer (Standard: 60)
  // ... andere Optionen
});
```

## Troubleshooting

### Chat Bubble wird nicht angezeigt

1. **Überprüfen Sie die Browser Console** (F12 → Console)
2. **Suchen Sie nach Fehlern**
3. **Überprüfen Sie, dass der Code in Footer eingefügt wurde** (nicht Header)
4. **Warten Sie 5-10 Minuten** - Squarespace braucht Zeit zum Cachen

### Chat funktioniert nicht

1. **Überprüfen Sie die Network Tab** (F12 → Network)
2. **Suchen Sie nach Requests zu prostarai.manus.space**
3. **Überprüfen Sie, dass die Requests erfolgreich sind** (Status 200)
4. **Überprüfen Sie die Browser Console** auf JavaScript-Fehler

### Bubble überlagert Inhalte

Das sollte nicht passieren, aber falls doch:

1. Gehen Sie zu **Settings → Advanced → Code Injection**
2. Ändern Sie den Code zu:

```html
<script>
  ProstarChatBubble.init({
    bubbleSize: 50, // Kleiner machen
    position: "bottom-left", // Andere Position
  });
</script>
```

## FAQ Responses

Der Chat Bubble antwortet auf folgende Fragen (Deutsch):

| Stichwort  | Antwort                                             |
| ---------- | --------------------------------------------------- |
| kurs       | Informationen über den Social-Media-Masterplan Kurs |
| preis      | Pricing-Informationen (€97, €197, €497)             |
| modul      | Beschreibung der 5 Kursinhalte                      |
| garantie   | 30-Tage Geld-zurück-Garantie                        |
| zugang     | Sofortiger Zugang nach Kauf                         |
| zertifikat | Zertifikat nach Abschluss                           |
| support    | Support-Optionen                                    |
| default    | Link zum Kurs                                       |

## Weitere Anpassungen

### Eigene FAQ-Antworten hinzufügen

Bearbeiten Sie die `getResponse()` Funktion in `prostar-chat-bubble.js`:

```javascript
getResponse(message) {
  const lowerMessage = message.toLowerCase();

  const responses = {
    'ihr-stichwort': 'Ihre Antwort hier',
    'anderes-stichwort': 'Andere Antwort',
    // ... mehr Antworten
  };

  // ... Rest des Codes
}
```

### API-Integration

Um echte API-Responses zu verwenden statt Mock-Responses:

```javascript
sendMessage() {
  const input = document.getElementById('prostar-input');
  const message = input?.value?.trim();

  if (!message) return;

  this.addMessage(message, 'user');
  input.value = '';
  this.showTyping();

  // API Call
  fetch(`${this.config.apiUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context: 'prostarmarketing.de' })
  })
  .then(r => r.json())
  .then(data => {
    this.removeTyping();
    this.addMessage(data.response, 'bot');
  })
  .catch(e => {
    this.removeTyping();
    this.addMessage('Entschuldigung, ich konnte keine Verbindung herstellen.', 'bot');
  });
}
```

## Support

Bei Fragen oder Problemen:

1. Überprüfen Sie die Browser Console (F12)
2. Überprüfen Sie die Network Tab
3. Kontaktieren Sie den ProStar Support

---

**Glückwunsch!** Ihr ProStar AI Chat Bubble ist jetzt auf prostarmarketing.de aktiv! 🎉
