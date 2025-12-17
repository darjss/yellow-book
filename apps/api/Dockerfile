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

# Create minimal package.json for production dependencies
RUN cat > package.json << 'EOF'
{
  "name": "yellow-book-api",
  "version": "1.0.0",
  "dependencies": {
    "@prisma/client": "^6.16.2",
    "@fastify/cors": "^11.1.0",
    "@fastify/sensible": "^6.0.2",
    "@trpc/server": "^11.5.1",
    "dotenv": "^17.2.3",
    "fastify": "^5.2.1",
    "fastify-plugin": "^5.0.1",
    "prisma": "^6.16.2",
    "zod": "^4.1.11",
    "@ai-sdk/google": "^2.0.46",
    "ai": "^5.0.113",
    "@upstash/redis": "^1.35.8"
  }
}
EOF

RUN bun install --production
COPY libs/db/prisma ./prisma
RUN bunx prisma generate

## Runtime stage
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built output (bundled main.js)
COPY --from=builder /app/dist/apps/api/main.js ./main.js
COPY --from=builder /app/dist/apps/api/package.json ./package.json

# Copy plugins and routes for autoload (fastify uses __dirname)
COPY --from=builder /app/dist/apps/api/src ./src

# Copy node_modules with Prisma client
COPY --from=prod-deps /app/node_modules ./node_modules

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start Fastify app
CMD ["bun", "main.js"]


