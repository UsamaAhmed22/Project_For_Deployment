# =========================
# Build Stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build Vite app
RUN pnpm run build


# =========================
# Runtime Stage
# =========================
FROM nginx:1.27-alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA + health check config
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
