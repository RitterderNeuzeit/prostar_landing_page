# 🚀 ProStar Landing Page - SOFORT STARTEN

## ✅ ALLES FERTIG! Los geht's in 2 Schritten:

### Option 1: SCHNELLSTER START (Empfohlen)
```bash
./start-local.sh
```
**Fertig!** Öffne: http://localhost:3000

---

### Option 2: Mit vollständigem Docker-Setup
```bash
./start-dev.sh
```
**Fertig!** Öffne: http://localhost:3000

---

### Option 3: Production (für öffentlichen Zugriff)
```bash
./start-prod.sh
```
**Fertig!** Öffne: http://localhost (Port 80)

---

## �� WIE MACHE ICH ES ÖFFENTLICH ERREICHBAR?

### Methode 1: Lokaler Server (Dein Rechner)

1. **Start Production:**
   ```bash
   ./start-prod.sh
   ```

2. **Finde deine IP:**
   ```bash
   curl ifconfig.me
   ```

3. **Router-Einstellungen:**
   - Gehe zu deinem Router (z.B. 192.168.1.1)
   - Port-Forwarding einrichten:
     - Port 80 → Deine lokale IP (z.B. 192.168.1.100)
     - Port 443 → Deine lokale IP

4. **Fertig!**
   Jeder kann jetzt über deine öffentliche IP zugreifen

---

### Methode 2: Azure (Professionell, kostenlos startbar)

```bash
# Azure CLI installieren
brew install azure-cli

# Login
az login

# Ressourcengruppe erstellen
az group create --name ProStar --location westeurope

# Container Registry erstellen  
az acr create --resource-group ProStar --name prostarregistry --sku Basic

# Image bauen
docker build -f Dockerfile.prod -t prostar:latest .

# Image zu Azure pushen
az acr login --name prostarregistry
docker tag prostar:latest prostarregistry.azurecr.io/prostar:latest
docker push prostarregistry.azurecr.io/prostar:latest

# Container App erstellen (öffentlich erreichbar!)
az containerapp create \
  --name prostar-landing \
  --resource-group ProStar \
  --image prostarregistry.azurecr.io/prostar:latest \
  --target-port 3000 \
  --ingress external \
  --query properties.configuration.ingress.fqdn

# Die URL wird angezeigt - FERTIG!
```

**Kosten:** Erste 180.000 Anfragen/Monat GRATIS

---

### Methode 3: Hetzner VPS (Günstig, ca. 4€/Monat)

1. **VPS mieten:** https://www.hetzner.com/cloud
2. **SSH einloggen:** `ssh root@DEINE_SERVER_IP`
3. **Docker installieren:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```
4. **Code hochladen:** (SFTP oder git clone)
5. **Starten:**
   ```bash
   ./start-prod.sh
   ```
6. **Firewall öffnen:**
   ```bash
   ufw allow 80
   ufw allow 443
   ```

**Fertig!** Erreichbar über: `http://DEINE_SERVER_IP`

---

### Methode 4: DigitalOcean (Einfach, ca. 6$/Monat)

1. **Droplet erstellen:** https://www.digitalocean.com
2. **Wähle:** Docker auf Ubuntu
3. **SSH einloggen**
4. **Code hochladen und starten:** `./start-prod.sh`

**Fertig!**

---

## 🔐 LOGIN FUNKTIONALITÄT

Deine Landing Page hat bereits:
- ✅ Benutzer-Registrierung
- ✅ Login/Logout  
- ✅ JWT Auth
- ✅ MySQL Datenbank
- ✅ Passwort-Hashing

**Erster User:**
Einfach auf der Website registrieren - der erste User ist automatisch Admin!

---

## 📊 WAS WURDE ALLES REPARIERT?

### Docker-Probleme behoben:
- ✅ MySQL Hostname-Problem (`localhost` → `mysql`)
- ✅ Netzwerk-Konfiguration zwischen Containern
- ✅ Healthchecks für zuverlässigen Start
- ✅ Automatische DB-Migration
- ✅ Corepack-Prompt-Problem

### Neue Dateien erstellt:
- ✅ `start-local.sh` - Schnellster lokaler Start
- ✅ `start-dev.sh` - Docker Development
- ✅ `start-prod.sh` - Docker Production
- ✅ `stop.sh` - Alles stoppen
- ✅ `docker-compose.yml` - Dev Setup
- ✅ `docker-compose.prod.yml` - Production Setup
- ✅ `Dockerfile` - Dev Image
- ✅ `Dockerfile.prod` - Production Image
- ✅ `.env` - Dev Variablen
- ✅ `.env.production` - Production Variablen

---

## 🛑 STOPPEN

```bash
./stop.sh
```

Oder manuell:
```bash
docker stop prostar-mysql
docker compose down
```

---

## 🔧 PROBLEME?

### Port 3000 belegt?
```bash
lsof -i :3000
# Kill den Prozess oder ändere Port in docker-compose.yml
```

### MySQL Verbindung schlägt fehl?
```bash
docker logs prostar-mysql
docker exec -it prostar-mysql mysql -u root -pProStar2025DB!
```

### Container laufen nicht?
```bash
docker compose logs -f
docker compose ps
```

### Kompletter Neustart?
```bash
./stop.sh
docker system prune -a  # ACHTUNG: Löscht ALLES
./start-dev.sh
```

---

## 💡 WICHTIGE TIPPS

### Für Production (öffentlich erreichbar):
1. **Passwörter ändern!**
   - Editiere `.env.production`
   - Ändere `JWT_SECRET`
   - Ändere `MYSQL_ROOT_PASSWORD`

2. **Echte Stripe Keys:**
   - Hole dir Production Keys von https://stripe.com
   - Trage sie in `.env.production` ein

3. **SSL-Zertifikat (HTTPS):**
   - Nutze Caddy als Reverse Proxy (automatisches SSL)
   - Oder: Let's Encrypt manuell

4. **Domain:**
   - Kaufe eine Domain (z.B. bei Namecheap)
   - A-Record auf deine Server-IP setzen

---

## 📞 SUPPORT

Wenn etwas nicht klappt:

1. **Logs checken:**
   ```bash
   docker compose logs -f
   ```

2. **Container Status:**
   ```bash
   docker compose ps
   ```

3. **In Container einsteigen:**
   ```bash
   docker exec -it prostar_dev sh
   ```

---

## 🎉 DU BIST FERTIG!

Wähle eine Start-Option oben und leg los!

**Empfehlung für Anfang:** `./start-local.sh`  
**Für öffentlichen Zugriff:** Azure oder Hetzner VPS

---

**Made with ❤️ by GitHub Copilot**
