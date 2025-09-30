# apps/web/Dockerfile

# 1) Deps stage
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Root workspace deps
COPY package.json package-lock.json bun.lock ./
# App manifests (so the workspace resolver knows about them)
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
# Source (web + api types + libs for TS)
COPY libs ./libs
COPY apps/api ./apps/api
COPY apps/web ./apps/web
COPY tsconfig.base.json tsconfig.json ./

RUN bun install

# 2) Build app (direct Next build, like the self-host example)
FROM deps AS builder
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN bunx next build

# Normalize to /out (standard Next standalone layout)
RUN mkdir -p /out/apps/web/.next && \
    cp -R .next/standalone/* /out/ && \
    cp -R .next/static /out/apps/web/.next/static && \
    cp -R public /out/apps/web/public

# 3) Runner
FROM oven/bun:1-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /out ./

EXPOSE 3000
CMD ["bun", "server.js"]