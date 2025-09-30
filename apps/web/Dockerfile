## Build stage
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json bun.lock ./
COPY apps/web/package.json ./apps/web/package.json
COPY libs ./libs
COPY apps/web ./apps/web
COPY tsconfig.base.json tsconfig.json ./

RUN bun install

FROM deps AS builder
ENV NEXT_TELEMETRY_DISABLED=1
RUN bunx nx build @yellow-book/web --configuration=production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone output
COPY --from=builder /app/dist/apps/web/apps/web/.next/standalone ./
COPY --from=builder /app/dist/apps/web/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000
CMD ["node", "apps/web/server.js"]


