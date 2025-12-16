## Build stage
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install OS deps needed for Prisma engines
RUN apk add --no-cache openssl

## Builder stage: install deps and build only API
FROM base AS builder

# Copy ONLY dependency files first for better caching
COPY package.json package-lock.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY libs/config/project.json ./libs/config/project.json
COPY libs/types/project.json ./libs/types/project.json
COPY libs/db/package.json ./libs/db/package.json
COPY tsconfig.base.json tsconfig.json ./

# Install dependencies (this layer is cached until package files change)
RUN bun install

# NOW copy source code (changes here won't bust the install cache)
COPY libs ./libs
COPY apps/api ./apps/api

# Generate Prisma client
WORKDIR /app
RUN bunx nx build @yellow-book/api --configuration=production && \
    bunx nx run @yellow-book/api:prune

## Production dependencies for API only
FROM base AS prod-deps
WORKDIR /app
COPY apps/api/package.json ./package.json
RUN bun install --production
COPY apps/api/prisma ./prisma
RUN bunx prisma generate

## Runtime stage
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built output
COPY --from=builder /app/dist/apps/api ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package.json ./package.json

# Prisma needs the query engine in production; it is present in node_modules of the builder.
# If using Accelerate/Data Proxy, ensure DATABASE_URL uses the proxy.

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start Fastify app
CMD ["bun", "main.js"]


