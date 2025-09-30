## Build stage
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install OS deps needed for Prisma engines
RUN apk add --no-cache openssl

## Builder stage: install deps and build only API
FROM base AS builder

# Leverage workspace package manager files for caching
COPY package.json package-lock.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY libs ./libs
COPY apps/api ./apps/api
COPY tsconfig.base.json tsconfig.json ./

RUN bun install

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
FROM node:20-alpine AS runner
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy built output
COPY --from=builder /app/dist/apps/api ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/package.json ./package.json

# Prisma needs the query engine in production; it is present in node_modules of the builder.
# If using Accelerate/Data Proxy, ensure DATABASE_URL uses the proxy.

EXPOSE 3001

# Start Fastify app
CMD ["node", "main.js"]


