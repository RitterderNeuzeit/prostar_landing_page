# 🐳 ProStar Landing Page - Docker Setup

## 🚀 Schnellstart (3 Befehle)

### Development (lokal testen)
```bash
./start-dev.sh
```
Öffne: http://localhost:3000

### Production (öffentlich erreichbar)
```bash
./start-prod.sh
```
Öffne: http://localhost (Port 80)

### Stoppen
```bash
./stop.sh
```

---

## 📦 Was wurde repariert?

### Hauptprobleme behoben:
1. ✅ MySQL Container-Hostname (`localhost` → `mysql`)
2. ✅ Healthchecks für zuverlässigen Start
3. ✅ Automatische DB-Migration beim Start
4. ✅ Netzwerk-Konfiguration zwischen Containern
5. ✅ Production-Ready Multi-Stage Build

### Neue Dateien:
- `docker-compose.yml` - Development Setup
- `docker-compose.prod.yml` - Production Setup  
- `Dockerfile` - Development Image
- `Dockerfile.prod` - Optimiertes Production Image
- `.env` - Development Variablen
- `.env.production` - Production Variablen
- `start-dev.sh` - Development starten
- `start-prod.sh` - Production starten
- `stop.sh` - Alles stoppen

---

## 🌍 Öffentlich erreichbar machen

### Option 1: Lokaler Server (eigene Hardware)

1. **Router konfigurieren:**
   - Port 80 (HTTP) → Dein Rechner
   - Port 443 (HTTPS) → Dein Rechner

2. **Deine öffentliche IP finden:**
   ```bash
   curl ifconfig.me
   ```

3. **Domain einrichten** (optional):
   - A-Record: `deine-domain.de` → `DEINE_IP`

4. **Production starten:**
   ```bash
   ./start-prod.sh
   ```

5. **SSL-Zertifikat** (empfohlen):
   - Nutze [Caddy](https://caddyserver.com/) als Reverse Proxy
   - Automatisches Let's Encrypt SSL

### Option 2: Cloud Hosting (empfohlen für echte Websites)

#### A) Azure Container Apps (einfach + managed)
```bash
# Azure CLI installieren
brew install azure-cli

# Login
az login

# Container Registry erstellen
az acr create --resource-group ProStar --name prostarregistry --sku Basic

# Image bauen und pushen
docker tag prostar_landing_prod:latest prostarregistry.azurecr.io/prostar:latest
docker push prostarregistry.azurecr.io/prostar:latest

# Container App erstellen
az containerapp create \
  --name prostar-landing \
  --resource-group ProStar \
  --image prostarregistry.azurecr.io/prostar:latest \
  --target-port 3000 \
  --ingress external
```

#### B) DigitalOcean / Hetzner VPS (günstig)
1. VPS mieten (5-10€/Monat)
2. Docker installieren
3. Code hochladen
4. `./start-prod.sh` ausführen
5. Firewall Ports freigeben

#### C) Docker Hub + Cloud Run
```bash
# Login Docker Hub
docker login

# Image pushen
docker tag prostar_landing_prod:latest deinusername/prostar:latest
docker push deinusername/prostar:latest

# Auf beliebiger Cloud-Plattform deployen
```

---

## 🔧 Troubleshooting

### Container starten nicht?
```bash
# Logs anschauen
docker-compose logs -f

# Einzelne Services checken
docker-compose ps
docker-compose logs mysql
docker-compose logs app
```

### Port 3000 schon belegt?
```bash
# Finde den Prozess
lsof -i :3000

# Oder ändere Port in docker-compose.yml
ports:
  - "8080:3000"  # Nutze 8080 statt 3000
```

### MySQL Verbindung schlägt fehl?
```bash
# Prüfe ob MySQL läuft
docker exec -it prostar_mysql mysql -u root -p
# Passwort: ProStar2025DB!

# Datenbank existiert?
SHOW DATABASES;
```

### Neustart (alles löschen)
```bash
docker-compose down -v  # Löscht auch Volumes (DB-Daten!)
docker system prune -a  # Räumt alles auf
./start-dev.sh         # Frischer Start
```

---

## 📝 Konfiguration anpassen

### Environment-Variablen ändern
Editiere `.env` (dev) oder `.env.production` (prod):
```bash
nano .env.production
```

**Wichtig zu ändern für Production:**
- `JWT_SECRET` - Zufälligen String generieren
- `MYSQL_ROOT_PASSWORD` - Sicheres Passwort
- `STRIPE_SECRET_KEY` - Echte Stripe Keys
- `SITE_URL` - Deine Domain

### Ports ändern
Editiere `docker-compose.yml` oder `docker-compose.prod.yml`:
```yaml
ports:
  - "DEIN_PORT:3000"
```

---

## 🎯 Login-Funktionalität

Die Landing Page hat bereits:
- ✅ Benutzer-Registrierung
- ✅ Login/Logout
- ✅ JWT-basierte Auth
- ✅ MySQL Datenbank

**Erster Admin-User anlegen:**
Nach dem Start kannst du dich einfach registrieren. Der erste User ist automatisch Admin.

---

## 💡 Tipps

- **Development:** Code-Änderungen werden live übernommen (Hot Reload)
- **Production:** Bei Code-Änderungen neu bauen: `./start-prod.sh`
- **Backups:** MySQL Daten sind in Docker Volume `mysql_prod_data`
- **Monitoring:** Nutze `docker stats` für Live-Metriken

---

## 🆘 Hilfe bekommen

Wenn etwas nicht funktioniert:
1. Logs checken: `docker-compose logs -f`
2. Container Status: `docker-compose ps`
3. In Container einsteigen: `docker exec -it prostar_dev sh`

**Häufige Fehler:**
- Port belegt → Anderen Port nutzen
- MySQL nicht erreichbar → 10s länger warten
- Build schlägt fehl → `node_modules` lokal löschen

---

✅ **Du bist ready!** Führe einfach `./start-dev.sh` aus und deine Landing Page läuft.
