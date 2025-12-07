# 🚀 SOFORT-ANLEITUNG: Railway Workspace beitreten

## ⚡ SCHRITT 1: Workspace-Invite annehmen (1 Min)

### Link öffnen:
```
https://railway.com/invite/9Fv5LtRqV9K
```

### Was passiert:
1. Du wirst zu Railway weitergeleitet
2. Melde dich mit deinem Railway-Account an (falls nicht schon eingeloggt)
3. Du siehst: "You've been invited to join [Workspace Name]"
4. Klicke: **"Accept Invite"** oder **"Beitreten"**
5. Du siehst dann das Projekt: **"dependable-youthfulness"**

### Bestätigung:
✅ Du kannst jetzt das Projekt sehen:
```
https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619
```

---

## ⚡ SCHRITT 2: Vollautomatisches Script starten

Nachdem du den Invite angenommen hast:

```bash
bash complete-deployment.sh
```

Das Script macht dann automatisch:
1. ✅ Prüft Workspace-Zugriff
2. ✅ Zeigt deine Email-Credentials an (info@prostarmarketing.de)
3. ✅ Öffnet railway-env-production.txt zum Bearbeiten
4. ✅ Wartet bis du ENV vars in Railway eingefügt hast
5. ✅ Überwacht Railway Deployment (2-5 Min)
6. ✅ Führt dich durch DNS-Änderung (Google Domains)
7. ✅ Überwacht DNS-Propagation (15-60 Min)
8. ✅ Führt dich durch Custom Domain Setup
9. ✅ Wartet auf SSL-Zertifikat (5-10 Min)
10. ✅ Macht finale Tests
11. ✅ Öffnet https://kurs.prostarmarketing.de

---

## 📋 FEHLENDE CREDENTIALS

Das Script wird dich auffordern, folgende Platzhalter zu ergänzen:

### 1. Azure MySQL (DATABASE_URL)
```
Format: mysql://USER:PASS@SERVER.mysql.database.azure.com:3306/DB?ssl-mode=REQUIRED

Wo finden:
- Azure Portal → Deine MySQL-Datenbank → Connection Strings
```

### 2. Stripe Keys (optional, kann später ergänzt werden)
```
Test Keys: https://dashboard.stripe.com/test/apikeys

Benötigt:
- STRIPE_SECRET_KEY (sk_test_...)
- STRIPE_WEBHOOK_SECRET (whsec_...)
- STRIPE_PUBLISHABLE_KEY (pk_test_...)
```

**💡 TIPP:** Du kannst auch ohne DB & Stripe starten - das Script fragt dich!

---

## ⏱️ ZEITPLAN

| Schritt | Dauer | Wer |
|---------|-------|-----|
| Workspace-Invite annehmen | 1 Min | DU |
| Script starten | 0 Min | DU |
| ENV vars in Railway einfügen | 2-3 Min | DU |
| Railway Re-Deploy | 2-5 Min | AUTO |
| DNS in Google Domains ändern | 2 Min | DU |
| DNS-Propagation | 15-60 Min | AUTO |
| Custom Domain hinzufügen | 1 Min | DU |
| SSL-Zertifikat | 5-10 Min | AUTO |
| **GESAMT** | **~30-90 Min** | |

---

## 🎯 LOS GEHT'S!

### Jetzt ausführen:

1. **Workspace-Invite annehmen:**
   ```
   open https://railway.com/invite/9Fv5LtRqV9K
   ```

2. **Script starten:**
   ```bash
   bash complete-deployment.sh
   ```

3. **Anweisungen folgen** (Script führt dich durch alles!)

---

## 🆘 FALLS PROBLEME

**Script erneut starten:**
```bash
bash complete-deployment.sh
```

Das Script merkt sich, wo es aufgehört hat und springt zum richtigen Schritt!

**Status prüfen:**
```bash
bash check-deployment.sh
```

**Railway Logs prüfen:**
```
https://railway.app/project/fb2b6a6c-c10b-4192-89fa-b071b761f619
→ Deployments → Deploy Logs
```

---

**🚀 BEREIT? Öffne den Invite-Link und starte dann das Script!**
