# Build stage
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY libs ./libs
COPY apps/api ./apps/api
COPY apps/web ./apps/web
COPY tsconfig.base.json tsconfig.json ./

RUN bun install

FROM deps AS builder
ENV NEXT_TELEMETRY_DISABLED=1
RUN bunx nx build @yellow-book/web --configuration=production

# Normalize Next standalone output to /out regardless of Nx path variant
RUN set -eux; \
  mkdir -p /out/apps/web/.next; \
  if [ -d /app/dist/apps/web/apps/web/.next/standalone ]; then \
    cp -R /app/dist/apps/web/apps/web/.next/standalone/* /out/; \
    [ -d /app/dist/apps/web/apps/web/.next/static ] && cp -R /app/dist/apps/web/apps/web/.next/static /out/apps/web/.next/static || true; \
  elif [ -d /app/dist/apps/web/.next/standalone ]; then \
    cp -R /app/dist/apps/web/.next/standalone/* /out/; \
    [ -d /app/dist/apps/web/.next/static ] && cp -R /app/dist/apps/web/.next/static /out/apps/web/.next/static || true; \
  else \
    echo "Could not find Next standalone output" >&2; exit 1; \
  fi; \
  [ -d /app/apps/web/public ] && cp -R /app/apps/web/public /out/apps/web/public || true

FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy normalized output
COPY --from=builder /out ./

EXPOSE 3000
CMD ["bun", "apps/web/server.js"]