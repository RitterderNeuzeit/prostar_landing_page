# Custom Notification System - ProStar Landing Page

## Overview

The custom notification system provides a flexible, reusable way to display user feedback, alerts, and confirmations throughout the application. Notifications are managed globally through React Context and support multiple types, auto-dismiss, and custom actions.

---

## Architecture

### Components

**1. NotificationProvider** (`contexts/NotificationContext.tsx`)
- Global state management for notifications
- Provides `useNotification` hook for accessing notification functionality
- Handles notification lifecycle (creation, auto-dismiss, removal)

**2. NotificationContainer** (`components/NotificationContainer.tsx`)
- Renders all active notifications
- Positioned in top-right corner
- Supports multiple simultaneous notifications with queue management
- Includes accessibility features (ARIA live regions)

---

## Usage

### Basic Setup

The notification system is already integrated into the app. To use it in any component:

```tsx
import { useNotification } from '@/contexts/NotificationContext';

function MyComponent() {
  const { addNotification } = useNotification();

  const handleSuccess = () => {
    addNotification({
      type: 'success',
      title: 'Erfolg!',
      message: 'Ihre Aktion wurde erfolgreich abgeschlossen.',
      duration: 5000, // Auto-dismiss after 5 seconds
    });
  };

  return <button onClick={handleSuccess}>Bestätigen</button>;
}
```

### Notification Types

| Type | Usage | Color |
|------|-------|-------|
| `success` | Successful operations | Green (#22c55e) |
| `error` | Error messages | Red (#ef4444) |
| `warning` | Warning alerts | Yellow (#eab308) |
| `info` | Informational messages | Cyan (#06b6d4) |

### API Reference

#### `addNotification(notification)`

Adds a new notification to the queue.

**Parameters:**
```typescript
interface NotificationOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;                    // Notification title
  message: string;                  // Notification message
  duration?: number;                // Auto-dismiss time in ms (default: 5000)
  action?: {                        // Optional action button
    label: string;                  // Button text
    onClick: () => void;            // Callback function
  };
}
```

**Returns:** `string` (notification ID)

**Example:**
```tsx
const notificationId = addNotification({
  type: 'success',
  title: 'Kurs gebucht!',
  message: 'Du erhältst in Kürze eine Bestätigungsemail.',
  duration: 5000,
});
```

#### `removeNotification(id)`

Manually removes a notification by ID.

**Parameters:**
- `id: string` - Notification ID returned from `addNotification()`

**Example:**
```tsx
removeNotification(notificationId);
```

#### `clearAll()`

Removes all active notifications.

**Example:**
```tsx
clearAll();
```

---

## Common Use Cases

### 1. Form Submission Success

```tsx
const handleSubmit = async (formData) => {
  try {
    await submitForm(formData);
    addNotification({
      type: 'success',
      title: 'Erfolgreich!',
      message: 'Deine Anmeldung wurde verarbeitet.',
    });
  } catch (error) {
    addNotification({
      type: 'error',
      title: 'Fehler',
      message: 'Es gab ein Problem bei der Verarbeitung.',
    });
  }
};
```

### 2. Notification with Action

```tsx
addNotification({
  type: 'info',
  title: 'Neue Nachricht',
  message: 'Du hast eine neue Nachricht erhalten.',
  duration: 0, // Don't auto-dismiss
  action: {
    label: 'Anzeigen',
    onClick: () => navigateToMessages(),
  },
});
```

### 3. Persistent Warning

```tsx
addNotification({
  type: 'warning',
  title: 'Warnung',
  message: 'Diese Aktion kann nicht rückgängig gemacht werden.',
  duration: 0, // Requires manual dismissal
});
```

### 4. Error with Retry

```tsx
addNotification({
  type: 'error',
  title: 'Verbindungsfehler',
  message: 'Die Verbindung konnte nicht hergestellt werden.',
  action: {
    label: 'Erneut versuchen',
    onClick: () => retryConnection(),
  },
});
```

---

## Styling

### Notification Appearance

- **Position:** Top-right corner (fixed)
- **Animation:** Slide-in from right with fade-out
- **Backdrop:** Glassmorphism effect with blur
- **Colors:** Type-specific (green/red/yellow/cyan)
- **Border:** Subtle colored border matching type
- **Shadow:** Soft shadow for depth

### Customization

To customize notification styles, edit `NotificationContainer.tsx`:

```tsx
// Change position
className="fixed top-6 right-6 z-50 space-y-3"  // Current: top-right
// Alternative: "fixed bottom-6 left-6 z-50 space-y-3"  // Bottom-left

// Change animation
className="animate-slide-in-right"  // Current: slide from right
// Alternative: "animate-fade-in"  // Just fade in
```

---

## Accessibility

The notification system includes:

- **ARIA Live Regions:** `role="alert"` and `aria-live="polite"` for screen readers
- **Semantic HTML:** Proper heading hierarchy and button elements
- **Keyboard Navigation:** Close button accessible via Tab key
- **Color Independence:** Icons and text convey message type, not just color
- **Focus Management:** Close button receives focus when notification appears

---

## Best Practices

1. **Keep Messages Concise:** Use short, clear titles and messages
2. **Use Appropriate Types:** Match notification type to the situation
3. **Set Reasonable Durations:** 
   - Success/Info: 3-5 seconds
   - Warning: 5-10 seconds
   - Error: 0 (require manual dismissal)
4. **Avoid Notification Spam:** Limit simultaneous notifications to 3-4
5. **Provide Actions When Needed:** Use action buttons for important next steps
6. **Test Accessibility:** Verify screen reader compatibility

---

## Integration Examples

### Email Form Submission

```tsx
import { useNotification } from '@/contexts/NotificationContext';

export function EmailForm() {
  const { addNotification } = useNotification();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Subscription failed');

      addNotification({
        type: 'success',
        title: 'Angemeldet!',
        message: 'Danke für deine Anmeldung. Bitte überprüfe dein Email-Postfach.',
      });
      setEmail('');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Fehler',
        message: 'Es gab ein Problem bei der Anmeldung. Bitte versuche es später erneut.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="deine@email.com"
      />
      <button type="submit">Anmelden</button>
    </form>
  );
}
```

### Chat Message Sent

```tsx
const handleSendMessage = async () => {
  try {
    await sendChatMessage(inputValue);
    addNotification({
      type: 'success',
      title: 'Nachricht gesendet',
      message: 'Deine Nachricht wurde erfolgreich versendet.',
      duration: 3000,
    });
    setInputValue('');
  } catch (error) {
    addNotification({
      type: 'error',
      title: 'Fehler beim Versenden',
      message: 'Die Nachricht konnte nicht versendet werden.',
    });
  }
};
```

---

## Troubleshooting

### Notification Not Appearing

**Problem:** Notifications are not visible on the page.

**Solution:**
1. Verify `NotificationProvider` wraps your app in `App.tsx`
2. Verify `NotificationContainer` is rendered in `App.tsx`
3. Check browser console for errors
4. Ensure `useNotification` is called within a component wrapped by `NotificationProvider`

### Multiple Notifications Overlapping

**Problem:** Notifications are stacking on top of each other.

**Solution:** This is expected behavior. Notifications queue vertically with `space-y-3` gap. If you want to limit simultaneous notifications, modify `NotificationContainer.tsx`:

```tsx
{notifications.slice(-3).map((notification) => (  // Show only last 3
  // ...
))}
```

### Notification Dismisses Too Quickly

**Problem:** Notifications disappear before users can read them.

**Solution:** Increase the `duration` parameter:

```tsx
addNotification({
  type: 'info',
  message: 'Important message',
  duration: 10000,  // 10 seconds instead of default 5
});
```

---

## Future Enhancements

Potential improvements to the notification system:

1. **Sound Notifications:** Add optional audio feedback
2. **Notification History:** Store and display past notifications
3. **Custom Positioning:** Allow position configuration per notification
4. **Animation Variants:** More animation options (bounce, scale, etc.)
5. **Notification Groups:** Group related notifications
6. **Persistence:** Save important notifications to localStorage
7. **Desktop Notifications:** Integrate with browser Notification API

---

## Files

- **Context:** `client/src/contexts/NotificationContext.tsx`
- **Component:** `client/src/components/NotificationContainer.tsx`
- **Integration:** `client/src/App.tsx`

---

## Support

For questions or issues with the notification system, refer to the component source code or the examples above.
