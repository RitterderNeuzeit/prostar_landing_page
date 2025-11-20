# Google Domains → Squarespace Nameserver Setup

## 🎯 Ziel
Deine Domain `prostarmarketing.de` von Google Domains zu Squarespace verbinden

## ⏱️ Zeit: 5 Minuten

---

## SCHRITT 1: Google Domains öffnen

1. Gehe zu: **domains.google.com**
2. Melde dich an (mit deinem Google Account)
3. Wähle die Domain: **prostarmarketing.de**
4. Du siehst jetzt die Domain-Verwaltung

---

## SCHRITT 2: Zu DNS-Einstellungen gehen

1. Im linken Menü: Klick auf **"DNS"**
2. Du siehst verschiedene DNS-Optionen

---

## SCHRITT 3: Custom Nameservers aktivieren

1. Scrolle zu: **"Custom nameservers"** Sektion
2. Klick auf: **"Use custom nameservers"** (Button)
3. Es öffnet sich ein Eingabefeld

---

## SCHRITT 4: Squarespace Nameserver eintragen

Gib folgende 4 Nameserver ein:

```
1. ns1.squarespace.com
2. ns2.squarespace.com
3. ns3.squarespace.com
4. ns4.squarespace.com
```

**Wichtig:** Gib sie GENAU so ein (mit Punkt am Ende)

---

## SCHRITT 5: Speichern

1. Klick: **"Save"** oder **"Update"**
2. Google zeigt: "Changes saved" (grüne Bestätigung)
3. **FERTIG!**

---

## ⏳ Warte 24-48 Stunden

DNS braucht Zeit zum Propagieren:

- **0-4 Stunden**: Nameserver werden aktualisiert
- **4-24 Stunden**: Weltweit verbreitet
- **24-48 Stunden**: Vollständig propagiert

**Währenddessen:**
- Deine alte Website ist noch sichtbar (das ist normal)
- Nach 24h sollte Squarespace erscheinen

---

## ✅ TESTEN

Nach 24 Stunden:

1. Öffne: `https://prostarmarketing.de`
2. Sollte jetzt Squarespace zeigen
3. Wenn nicht: Warte noch 24h + leere Cache (Ctrl+Shift+Del)

---

## 🆘 Falls es nicht klappt

### Fehler: "Custom nameservers können nicht gesetzt werden"

**Lösung:**
1. Gehe zu: domains.google.com
2. Wähle Domain
3. Klick: Settings (oben rechts) → Domain settings
4. Prüfe: Ist die Domain "unlocked"?
5. Falls gesperrt: Unlock → dann Nameserver ändern

### Fehler: "Domain zeigt immer noch auf alte Website"

**Lösung:**
1. Warte weitere 12-24 Stunden (DNS Propagation)
2. Leere Browser Cache: Ctrl+Shift+Del
3. Nutze anderen Browser (Firefox, Safari, etc.)
4. Prüfe mit: https://dns.google
5. Query: prostarmarketing.de
6. Sollte Squarespace IPs zeigen

### Fehler: "Squarespace erkennt Domain nicht"

**Lösung:**
1. In Squarespace: Settings → Domains
2. Klick: "+ Connect domain"
3. Gib ein: prostarmarketing.de
4. Warte auf Squarespace Prüfung (5-10 Min)
5. Sollte dann "Connected" zeigen

---

## 📞 Support

**Google Domains Support:**
- https://support.google.com/domains
- Suchbegriff: "Custom nameservers"

**Squarespace Support (24/7, Deutsch):**
- https://support.squarespace.com
- Chat oder Email

---

## 🎉 Danach

Wenn Domain verbunden ist:

1. ✅ Upload Landing Page zu Squarespace
2. ✅ Google Analytics eintragen
3. ✅ Chat Widget integrieren
4. ✅ Tests durchführen
5. ✅ Marketing starten

---

**Viel Erfolg! 🚀**
