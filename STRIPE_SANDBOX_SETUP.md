# Stripe Sandbox Setup & Testing Guide

## 1. STRIPE SANDBOX AKTIVIERUNG

### Schritt 1: Sandbox beanspruchen
1. Gehen Sie zu: https://dashboard.stripe.com/claim_sandbox
2. Geben Sie Ihre E-Mail-Adresse ein
3. Bestätigen Sie die E-Mail
4. Wählen Sie ein Passwort
5. Aktivieren Sie den Test-Sandbox

**Deadline:** 2026-01-12T00:28:22.000Z (vor diesem Datum aktivieren!)

### Schritt 2: API-Keys konfigurieren
1. Gehen Sie zu Stripe Dashboard → Developers → API Keys
2. Kopieren Sie die **Test-Keys**:
   - Publishable Key (beginnt mit `pk_test_`)
   - Secret Key (beginnt mit `sk_test_`)
3. Speichern Sie diese in Ihren `.env` Variablen:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### Schritt 3: Webhook-Endpoint registrieren
1. Gehen Sie zu Stripe Dashboard → Developers → Webhooks
2. Klicken Sie auf "Add endpoint"
3. Geben Sie die Endpoint-URL ein:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Wählen Sie folgende Events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

---

## 2. TEST-KARTENNUMMERN

### Erfolgreiche Zahlungen
| Kartennummer | CVV | Ablaufdatum | Ergebnis |
|---|---|---|---|
| 4242 4242 4242 4242 | Beliebig | Beliebig (Zukunft) | ✓ Erfolg |
| 4000 0000 0000 0002 | Beliebig | Beliebig (Zukunft) | ✓ Erfolg |
| 5555 5555 5555 4444 | Beliebig | Beliebig (Zukunft) | ✓ Erfolg (Mastercard) |

### Fehlgeschlagene Zahlungen
| Kartennummer | Fehler |
|---|---|
| 4000 0000 0000 0002 | Zahlung abgelehnt |
| 4000 0000 0000 0069 | Ablaufdatum ungültig |
| 4000 0000 0000 0127 | CVC-Fehler |
| 4000 0000 0000 0341 | 3D Secure erforderlich |

### 3D Secure Test-Kartennummern
| Kartennummer | Authentifizierung |
|---|---|
| 4000 0025 0000 3155 | Authentifizierung erforderlich |
| 4000 0027 6000 3184 | Authentifizierung erforderlich |

---

## 3. TEST-TRANSAKTION DURCHFÜHREN

### Schritt 1: Landing Page öffnen
```
https://3000-i8wsyqfwbv8i5wcztegm1-a161a0e2.manus.computer
```

### Schritt 2: Pricing-Tier auswählen
1. Scrollen Sie zur **Pricing Section**
2. Klicken Sie auf einen der "Jetzt buchen" Buttons:
   - **Starter (€97)** - 3 Module
   - **Professional (€197)** - 8 Module  
   - **Enterprise (€497)** - 9 Module

### Schritt 3: Stripe Checkout öffnen
- Der Button sollte Sie zu Stripe Checkout weiterleiten
- Sie sehen ein Formular mit:
  - Email-Feld
  - Kartennummer
  - Ablaufdatum
  - CVC

### Schritt 4: Test-Kartendaten eingeben
```
Kartennummer: 4242 4242 4242 4242
Ablaufdatum: 12/25 (oder beliebiges zukünftiges Datum)
CVC: 123 (beliebig)
Postleitzahl: 12345 (beliebig)
```

### Schritt 5: Zahlung abschließen
1. Klicken Sie auf "Pay" oder "Zahlen"
2. Sie sollten zur Success-Seite weitergeleitet werden
3. Sie sehen:
   - ✓ Zahlungserfolg-Nachricht
   - Bestelldetails (Betrag, Tier, Bestellnummer)
   - "Zum Kurs" Button
   - Download-Optionen

---

## 4. ERFOLGREICHE TRANSAKTION ÜBERPRÜFEN

### Im Stripe Dashboard
1. Gehen Sie zu Stripe Dashboard → Payments
2. Sie sollten eine neue Payment Intent sehen mit:
   - Status: **Succeeded**
   - Betrag: €97, €197 oder €497
   - Kartennummer: 4242
   - Zeitstempel: Gerade eben

### In der Anwendung
1. Überprüfen Sie die Success-Seite:
   - Bestellnummer wird angezeigt
   - Tier-Informationen korrekt
   - Betrag korrekt formatiert
2. Klicken Sie auf "Zum Kurs":
   - Sie sollten zur Course-Seite weitergeleitet werden
   - Alle Module für den gekauften Tier sollten sichtbar sein
   - Expandierbare Module sollten funktionieren

---

## 5. WEBHOOK-TESTING

### Webhook-Ereignisse testen
1. Gehen Sie zu Stripe Dashboard → Developers → Webhooks
2. Klicken Sie auf Ihren Endpoint
3. Klicken Sie auf "Send test event"
4. Wählen Sie ein Event:
   - `payment_intent.succeeded`
   - `charge.refunded`
5. Klicken Sie auf "Send event"

### Webhook-Logs überprüfen
1. Gehen Sie zu Stripe Dashboard → Developers → Webhooks
2. Klicken Sie auf Ihren Endpoint
3. Scrollen Sie nach unten zu "Events"
4. Sie sollten sehen:
   - Event-Typ
   - Zeitstempel
   - Status: **Delivered** (grüner Haken)

---

## 6. FEHLERBEHANDLUNG TESTEN

### Test: Zahlung ablehnen
1. Verwenden Sie Kartennummer: `4000 0000 0000 0002`
2. Klicken Sie auf "Pay"
3. Sie sollten eine Fehlermeldung sehen
4. Sie sollten zur Checkout-Seite zurückgeleitet werden

### Test: Ungültiges Ablaufdatum
1. Verwenden Sie Kartennummer: `4000 0000 0000 0069`
2. Geben Sie ein Ablaufdatum in der Vergangenheit ein
3. Sie sollten eine Fehlermeldung sehen

### Test: CVC-Fehler
1. Verwenden Sie Kartennummer: `4000 0000 0000 0127`
2. Geben Sie einen ungültigen CVC ein
3. Sie sollten eine Fehlermeldung sehen

---

## 7. LIVE-UMGEBUNG VORBEREITUNG

### Schritt 1: KYC-Verifizierung
1. Gehen Sie zu Stripe Dashboard → Settings → Account
2. Füllen Sie die KYC-Informationen aus:
   - Geschäftsname
   - Geschäftsadresse
   - Geschäftstyp
   - Geschäftstätigkeit
3. Warten Sie auf Genehmigung (1-2 Geschäftstage)

### Schritt 2: Live-Keys aktivieren
1. Gehen Sie zu Stripe Dashboard → Developers → API Keys
2. Schalten Sie zu "Live" um
3. Kopieren Sie die Live-Keys:
   - Publishable Key (beginnt mit `pk_live_`)
   - Secret Key (beginnt mit `sk_live_`)

### Schritt 3: Produktkatalog erstellen
1. Gehen Sie zu Stripe Dashboard → Products
2. Erstellen Sie Produkte für jeden Tier:
   - **Starter Course** - €97
   - **Professional Course** - €197
   - **Enterprise Course** - €497
3. Kopieren Sie die Price IDs
4. Aktualisieren Sie `server/stripe/products.ts` mit den Live-Price-IDs

### Schritt 4: Webhook für Live registrieren
1. Gehen Sie zu Stripe Dashboard → Developers → Webhooks
2. Registrieren Sie einen neuen Endpoint für Live:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
3. Wählen Sie die gleichen Events wie für Test

---

## 8. CHECKLISTE FÜR LAUNCH

- [ ] Stripe Sandbox aktiviert
- [ ] API-Keys in `.env` konfiguriert
- [ ] Test-Transaktion erfolgreich durchgeführt
- [ ] Success-Seite funktioniert
- [ ] Course-Zugriff nach Kauf funktioniert
- [ ] Webhook-Events werden empfangen
- [ ] Fehlerbehandlung getestet
- [ ] KYC-Verifizierung abgeschlossen
- [ ] Live-Keys aktiviert
- [ ] Produktkatalog in Live erstellt
- [ ] Live-Webhook registriert
- [ ] Domain konfiguriert
- [ ] SSL-Zertifikat aktiv
- [ ] Zahlungsbestätigungsemails konfiguriert

---

## 9. HÄUFIGE PROBLEME & LÖSUNGEN

### Problem: "Invalid API Key"
**Lösung:** Überprüfen Sie, dass Sie die richtige API-Key-Version verwenden (Test vs. Live)

### Problem: Webhook wird nicht empfangen
**Lösung:** 
1. Überprüfen Sie die Endpoint-URL
2. Überprüfen Sie, dass alle erforderlichen Events ausgewählt sind
3. Überprüfen Sie die Webhook-Logs auf Fehler

### Problem: Checkout-Seite lädt nicht
**Lösung:**
1. Überprüfen Sie, dass `VITE_STRIPE_PUBLISHABLE_KEY` korrekt ist
2. Überprüfen Sie die Browser-Konsole auf Fehler
3. Überprüfen Sie, dass die Stripe.js Bibliothek geladen wird

### Problem: Success-Seite wird nicht angezeigt
**Lösung:**
1. Überprüfen Sie, dass die Success-Route in `App.tsx` registriert ist
2. Überprüfen Sie die Browser-Konsole auf Fehler
3. Überprüfen Sie, dass die Session-ID korrekt übergeben wird

---

## 10. KONTAKT & SUPPORT

**Stripe Support:** https://support.stripe.com
**Stripe Dokumentation:** https://stripe.com/docs
**Stripe Test-Kartennummern:** https://stripe.com/docs/testing

---

**Letzte Aktualisierung:** 2025-11-15
**Status:** ✓ Bereit für Testing
