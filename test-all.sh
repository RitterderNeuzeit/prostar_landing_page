#!/bin/bash

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0
PASSED=0

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   ProStar Landing Page - KOMPLETTER SYSTEM-TEST               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

log_pass() {
    echo -e "${GREEN}[✓]${NC} $1"
    ((PASSED++))
}

log_fail() {
    echo -e "${RED}[✗]${NC} $1"
    ((ERRORS++))
}

log_warn() {
    echo -e "${YELLOW}[⚠]${NC} $1"
    ((WARNINGS++))
}

echo "1. DATEISYSTEM-TESTS"
echo "════════════════════════════════════════════════════════════════"

files=("package.json" "Dockerfile" "docker-compose.yml" ".env" "start-local.sh" "start-dev.sh" "start-prod.sh" "stop.sh")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        log_pass "Datei: $file"
    else
        log_fail "Fehlt: $file"
    fi
done

scripts=("start-local.sh" "start-dev.sh" "start-prod.sh" "stop.sh")
for script in "${scripts[@]}"; do
    if [ -x "$script" ]; then
        log_pass "Ausführbar: $script"
    else
        log_warn "Nicht ausführbar: $script"
    fi
done

echo ""
echo "2. DOCKER-TESTS"
echo "════════════════════════════════════════════════════════════════"

if command -v docker &> /dev/null; then
    log_pass "Docker installiert: $(docker --version | cut -d' ' -f3)"
else
    log_fail "Docker nicht installiert"
fi

if docker info &> /dev/null; then
    log_pass "Docker Daemon läuft"
else
    log_fail "Docker Daemon läuft nicht"
fi

echo ""
echo "3. UMGEBUNG-TESTS"
echo "════════════════════════════════════════════════════════════════"

required_vars=("NODE_ENV" "PORT" "DATABASE_URL" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env 2>/dev/null; then
        log_pass "Variable: $var"
    else
        log_fail "Fehlt: $var"
    fi
done

echo ""
echo "4. DATENBANK-TESTS"
echo "════════════════════════════════════════════════════════════════"

if docker ps --format '{{.Names}}' | grep -q "prostar-mysql"; then
    log_pass "MySQL Container läuft"
    if docker exec prostar-mysql mysql -u root -pProStar2025DB! -e "SELECT 1" &> /dev/null; then
        log_pass "MySQL Verbindung OK"
    else
        log_fail "MySQL Verbindung fehlgeschlagen"
    fi
else
    log_warn "MySQL Container läuft nicht"
fi

echo ""
echo "5. NODE.JS TESTS"
echo "════════════════════════════════════════════════════════════════"

if command -v node &> /dev/null; then
    log_pass "Node.js: $(node --version)"
else
    log_fail "Node.js nicht installiert"
fi

if command -v pnpm &> /dev/null; then
    log_pass "pnpm: $(pnpm --version)"
else
    log_warn "pnpm nicht installiert"
fi

if [ -d "node_modules" ]; then
    log_pass "node_modules vorhanden"
else
    log_warn "node_modules fehlt"
fi

echo ""
echo "6. PORT-TESTS"
echo "════════════════════════════════════════════════════════════════"

for port in 3000 3001 3306; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warn "Port $port belegt"
    else
        log_pass "Port $port frei"
    fi
done

echo ""
echo "7. SICHERHEITS-TESTS"
echo "════════════════════════════════════════════════════════════════"

if grep -q "dev_secret_key" .env.production 2>/dev/null; then
    log_warn "Production nutzt Dev-Secrets!"
else
    log_pass "Production Secrets OK"
fi

if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        log_pass ".gitignore schützt .env"
    else
        log_warn ".gitignore unvollständig"
    fi
fi

echo ""
echo "8. SCRIPT-SYNTAX TESTS"
echo "════════════════════════════════════════════════════════════════"

for script in start-local.sh start-dev.sh start-prod.sh stop.sh; do
    if [ -f "$script" ]; then
        if bash -n "$script" 2>/dev/null; then
            log_pass "$script Syntax OK"
        else
            log_fail "$script Syntax-Fehler"
        fi
    fi
done

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "ERGEBNIS"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}Erfolgreich:${NC} $PASSED"
echo -e "${YELLOW}Warnungen:${NC}   $WARNINGS"
echo -e "${RED}Fehler:${NC}      $ERRORS"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ SYSTEM BEREIT!${NC}"
    echo "Starte mit: ./start-local.sh"
    exit 0
else
    echo -e "${RED}✗ FEHLER GEFUNDEN${NC}"
    echo "Behebe Fehler vor dem Start"
    exit 1
fi
