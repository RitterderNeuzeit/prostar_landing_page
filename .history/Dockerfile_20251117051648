FROM node:20-slim

# Verwende non-root user
RUN useradd -m appuser || true
WORKDIR /usr/src/app

# Aktivieren corepack + pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate || true

# Kopiere package files zuerst zur schnellen Installation
COPY package.json pnpm-lock.yaml ./

# Installiere deps (Prod deps) - in dev wir mounten lokalen code
RUN pnpm install --frozen-lockfile --prefer-offline --ignore-scripts || true

# Kopiere Projekt
COPY . .

RUN chown -R appuser:appuser /usr/src/app

USER appuser

ENV NODE_ENV=development
EXPOSE 3000

# Default: dev server (Vite middleware + server watch)
CMD ["pnpm", "dev"]
