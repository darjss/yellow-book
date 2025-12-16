import { Redis } from '@upstash/redis';

// Initialize Redis client from environment variables (optional - caching will be disabled if not configured)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : null;

// Cache TTL in seconds (1 hour)
export const CACHE_TTL = 3600;

// Generate a cache key from a query string
export function getCacheKey(query: string): string {
  // Normalize the query (lowercase, trim whitespace)
  const normalized = query.toLowerCase().trim();
  return `ai:assistant:${normalized}`;
}

// Cache operations
export async function getCachedResponse(query: string): Promise<string | null> {
  if (!redis) return null;
  try {
    const key = getCacheKey(query);
    return await redis.get<string>(key);
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function setCachedResponse(
  query: string,
  response: string
): Promise<void> {
  if (!redis) return;
  try {
    const key = getCacheKey(query);
    await redis.set(key, response, { ex: CACHE_TTL });
  } catch (error) {
    console.error('Redis set error:', error);
  }
}
