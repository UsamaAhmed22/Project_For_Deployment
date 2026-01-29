# =========================
# Build Stage (glibc, NOT alpine)
# =========================
FROM node:20-slim AS builder

WORKDIR /app

# Copy lockfiles first (better caching)
COPY package.json pnpm-lock.yaml ./

# Pin pnpm version (matches your lockfile)
RUN corepack enable \
 && corepack prepare pnpm@9.12.3 --activate \
 && pnpm --version \
 && pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build app
RUN pnpm run build


# =========================
# Runtime Stage (lightweight)
# =========================
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA + health check
RUN printf '%s\n' \
'server {' \
'  listen 80;' \
'  server_name _;' \
'  root /usr/share/nginx/html;' \
'  index index.html;' \
'  location / {' \
'    try_files $uri $uri/ /index.html;' \
'  }' \
'  location = /healthz {' \
'    return 200 "ok\n";' \
'  }' \
'}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://127.0.0.1/healthz || exit 1
