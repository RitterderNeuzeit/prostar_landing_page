FROM node:20-slim

# Installiere wget für Healthcheck
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Aktiviere Corepack und installiere pnpm (NON-INTERACTIVE!)
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Verwende non-root user VOR dem Kopieren
RUN useradd -m appuser && chown -R appuser:appuser /usr/src/app

USER appuser

# Kopiere package files UND patches
COPY --chown=appuser:appuser package.json pnpm-lock.yaml ./
COPY --chown=appuser:appuser patches ./patches

# Installiere deps
RUN pnpm install --frozen-lockfile --prefer-offline || pnpm install --no-frozen-lockfile

# Kopiere restliches Projekt
COPY --chown=appuser:appuser . .

ENV NODE_ENV=development
EXPOSE 3000

# Default: dev server (Vite middleware + server watch)
CMD ["pnpm", "dev"]
