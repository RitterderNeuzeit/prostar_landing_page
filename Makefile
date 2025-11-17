SHELL := /bin/bash

.PHONY: all install check test build start dev debug-collect install-pnpm

all: check

install: install-pnpm

install-pnpm:
	@echo "Installiere pnpm (wenn nötig) mit corepack oder npm..."
	@if command -v corepack >/dev/null 2>&1; then \
		corepack prepare pnpm@latest --activate || true; \
		echo "pnpm available via corepack"; \
	elif command -v npm >/dev/null 2>&1; then \
		echo "npm gefunden, installiere pnpm global..."; \
		npm install -g pnpm || true; \
	else \
		echo "Weder corepack noch npm gefunden — bitte Node/npm installieren"; exit 1; \
	fi

check:
	pnpm run check

test:
	pnpm test

build:
	pnpm build

start:
	pnpm start

dev:
	pnpm dev

debug-collect:
	chmod +x tools/collect-debug.sh && tools/collect-debug.sh

docker-build:
	docker compose -f docker-compose.yml build

docker-up:
	docker compose -f docker-compose.yml up -d --remove-orphans

docker-down:
	docker compose -f docker-compose.yml down

docker-build-prod:
	docker compose -f docker-compose.prod.yml build

docker-up-prod:
	docker compose -f docker-compose.prod.yml up -d --remove-orphans

docker-down-prod:
	docker compose -f docker-compose.prod.yml down
