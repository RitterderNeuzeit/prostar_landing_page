# Notification Action Buttons - Comprehensive Guide

## Overview

The notification system now supports multiple action buttons with different variants (primary, secondary, danger). This allows users to take direct actions from notifications without leaving the current page.

---

## Basic Usage

### Single Action Button

```javascript
import { useNotification } from '@/contexts/NotificationContext';

function MyComponent() {
  const { addNotification } = useNotification();

  const handleUndo = () => {
    console.log('Action undone!');
  };

  const handleClick = () => {
    addNotification({
      type: 'success',
      title: 'Änderung gespeichert',
      message: 'Ihre Änderungen wurden erfolgreich gespeichert.',
      action: {
        label: 'Rückgängig machen',
        onClick: handleUndo,
        variant: 'secondary'
      }
    });
  };

  return <button onClick={handleClick}>Speichern</button>;
}
```

### Multiple Action Buttons

```javascript
const handleClick = () => {
  addNotification({
    type: 'info',
    title: 'Kurs verfügbar',
    message: 'Der neue "KI-Masterplan" Kurs ist jetzt verfügbar!',
    actions: [
      {
        label: 'Jetzt ansehen',
        onClick: () => window.location.href = '/course-info',
        variant: 'primary'
      },
      {
        label: 'Später',
        onClick: () => console.log('Dismissed'),
        variant: 'secondary'
      }
    ]
  });
};
```

---

## Button Variants

### 1. Primary (Neon Cyan - ProStar Brand)
Used for main CTAs and important actions.

```javascript
{
  label: 'Jetzt buchen',
  onClick: handleBooking,
  variant: 'primary'
}
```

**Styling:** Cyan background with hover effect
**Use Case:** Purchase CTAs, course enrollment, main actions

### 2. Secondary (Default - White/Gray)
Used for secondary actions or confirmations.

```javascript
{
  label: 'Rückgängig machen',
  onClick: handleUndo,
  variant: 'secondary'
}
```

**Styling:** White/gray background with hover effect
**Use Case:** Undo, cancel, dismiss actions

### 3. Danger (Red)
Used for destructive actions or warnings.

```javascript
{
  label: 'Löschen',
  onClick: handleDelete,
  variant: 'danger'
}
```

**Styling:** Red background with hover effect
**Use Case:** Delete, remove, cancel subscription

---

## Real-World Examples

### Example 1: Course Purchase Notification

```javascript
const handlePurchaseSuccess = () => {
  const { addNotification } = useNotification();

  addNotification({
    type: 'success',
    title: 'Kauf erfolgreich! 🎉',
    message: 'Sie haben den "Von Zero zum KI-Profi" Kurs gekauft. Ihr Zugang ist sofort aktiv.',
    duration: 10000,
    actions: [
      {
        label: 'Zum Kurs',
        onClick: () => window.location.href = '/course',
        variant: 'primary'
      },
      {
        label: 'Rechnung',
        onClick: () => window.location.href = '/invoices',
        variant: 'secondary'
      }
    ]
  });
};
```

### Example 2: Email Signup Notification

```javascript
const handleEmailSignup = () => {
  const { addNotification } = useNotification();

  addNotification({
    type: 'info',
    title: 'Willkommen! 👋',
    message: 'Bestätigen Sie Ihre E-Mail-Adresse, um Zugang zu exklusiven Inhalten zu erhalten.',
    duration: 0, // Don't auto-dismiss
    actions: [
      {
        label: 'E-Mail bestätigen',
        onClick: () => window.location.href = '/verify-email',
        variant: 'primary'
      },
      {
        label: 'Später',
        onClick: () => console.log('Dismissed'),
        variant: 'secondary'
      }
    ]
  });
};
```

### Example 3: Error with Recovery

```javascript
const handlePaymentError = () => {
  const { addNotification } = useNotification();

  addNotification({
    type: 'error',
    title: 'Zahlungsfehler',
    message: 'Ihre Zahlung konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.',
    actions: [
      {
        label: 'Erneut versuchen',
        onClick: () => handleRetryPayment(),
        variant: 'primary'
      },
      {
        label: 'Support kontaktieren',
        onClick: () => window.location.href = '/support',
        variant: 'secondary'
      }
    ]
  });
};
```

### Example 4: Warning with Confirmation

```javascript
const handleDeleteAccount = () => {
  const { addNotification } = useNotification();

  addNotification({
    type: 'warning',
    title: 'Konto löschen?',
    message: 'Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden gelöscht.',
    duration: 0,
    actions: [
      {
        label: 'Ja, löschen',
        onClick: () => performAccountDeletion(),
        variant: 'danger'
      },
      {
        label: 'Abbrechen',
        onClick: () => console.log('Cancelled'),
        variant: 'secondary'
      }
    ]
  });
};
```

---

## Advanced Patterns

### Pattern 1: Undo Action

```javascript
const handleSave = async () => {
  const { addNotification } = useNotification();
  const previousState = getCurrentState();

  // Save changes
  await saveChanges();

  addNotification({
    type: 'success',
    title: 'Gespeichert',
    message: 'Ihre Änderungen wurden gespeichert.',
    duration: 5000,
    action: {
      label: 'Rückgängig',
      onClick: () => restoreState(previousState),
      variant: 'secondary'
    }
  });
};
```

### Pattern 2: Conversion Funnel

```javascript
const handleMiniCourseStart = () => {
  const { addNotification } = useNotification();

  addNotification({
    type: 'info',
    title: 'Mini-Kurs gestartet! 🚀',
    message: 'Sie erhalten gleich die erste Lektion. Viel Erfolg!',
    actions: [
      {
        label: 'Zur Lektion',
        onClick: () => window.location.href = '/mini-course/lesson-1',
        variant: 'primary'
      },
      {
        label: 'Vollkurs ansehen',
        onClick: () => window.location.href = '/course-info',
        variant: 'secondary'
      }
    ]
  });
};
```

### Pattern 3: Progressive Disclosure

```javascript
const handleLimitReached = () => {
  const { addNotification } = useNotification();

  addNotification({
    type: 'warning',
    title: 'Limit erreicht',
    message: 'Sie haben Ihr kostenloses Limit erreicht. Upgraden Sie für unbegrenzten Zugriff.',
    actions: [
      {
        label: 'Jetzt upgraden',
        onClick: () => window.location.href = '/pricing',
        variant: 'primary'
      },
      {
        label: 'Mehr erfahren',
        onClick: () => window.location.href = '/faq#limits',
        variant: 'secondary'
      }
    ]
  });
};
```

---

## Styling Reference

### Button Variants CSS

```css
/* Primary (Neon Cyan) */
.btn-primary {
  background-color: rgba(0, 217, 255, 0.3);
  color: rgb(165, 243, 252);
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: rgba(0, 217, 255, 0.5);
}

/* Secondary (White/Gray) */
.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Danger (Red) */
.btn-danger {
  background-color: rgba(239, 68, 68, 0.3);
  color: rgb(254, 202, 202);
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-danger:hover {
  background-color: rgba(239, 68, 68, 0.5);
}
```

---

## Best Practices

1. **Keep Labels Short** – Use 1-2 words for button labels (e.g., "Jetzt buchen", "Rückgängig")

2. **Use Variants Correctly:**
   - Primary: Main CTAs and important actions
   - Secondary: Alternative or dismissal actions
   - Danger: Destructive or warning actions

3. **Set Duration Wisely:**
   - Success: 5000ms (5 seconds)
   - Error: 0 (don't auto-dismiss)
   - Warning: 0 (don't auto-dismiss)
   - Info: 10000ms (10 seconds)

4. **Limit Button Count** – Use max 2-3 buttons per notification

5. **Action Callbacks** – Keep onClick handlers simple and fast

6. **Accessibility** – Always include descriptive labels

---

## Migration Guide

### Old Syntax (Single Action)
```javascript
addNotification({
  type: 'success',
  title: 'Saved',
  message: 'Changes saved successfully',
  action: {
    label: 'Undo',
    onClick: handleUndo
  }
});
```

### New Syntax (Multiple Actions)
```javascript
addNotification({
  type: 'success',
  title: 'Saved',
  message: 'Changes saved successfully',
  actions: [
    {
      label: 'Undo',
      onClick: handleUndo,
      variant: 'secondary'
    },
    {
      label: 'View',
      onClick: handleView,
      variant: 'primary'
    }
  ]
});
```

**Note:** The old `action` syntax still works for backward compatibility, but `actions` is recommended for new code.

---

## Testing Checklist

- [ ] Single action button displays correctly
- [ ] Multiple action buttons display in a row
- [ ] Button click handlers execute correctly
- [ ] Notification closes after button click
- [ ] All three variants (primary, secondary, danger) display correctly
- [ ] Buttons are keyboard accessible
- [ ] Buttons have proper hover states
- [ ] Long labels wrap correctly
- [ ] Notifications stack properly with multiple notifications
- [ ] Close button (X) still works with action buttons

---

## Troubleshooting

**Q: Buttons not displaying?**
A: Ensure you're using `actions` (array) not `action` (single). Or use the deprecated `action` syntax.

**Q: Notification closes too quickly?**
A: Set `duration: 0` to prevent auto-dismiss.

**Q: Button text is cut off?**
A: Keep labels short (1-2 words) or the container will wrap them.

**Q: Buttons not styled correctly?**
A: Verify the `variant` prop is set to 'primary', 'secondary', or 'danger'.
