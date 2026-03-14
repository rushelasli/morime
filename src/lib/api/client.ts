import { JikanClient } from "@rushelasli/jikants";

/**
 * Jikan API Client Singleton
 *
 * This client provides access to all Jikan API endpoints with:
 * - Built-in caching (24 hours default)
 * - Full TypeScript support
 * - Rate limiting compliance
 */

const CACHE_TTL = 24 * 60 * 60 * 1000;

let jikanInstance: JikanClient | null = null;

/**
 * Get or create Jikan client instance
 */
export function getJikanClient(): JikanClient {
  if (!jikanInstance) {
    jikanInstance = new JikanClient({
      cacheOptions: {
        ttl: CACHE_TTL,
      },
      enableLogging: process.env.NODE_ENV === "development",
    });
  }

  return jikanInstance;
}

/**
 * Clear all cached data
 */
export async function clearJikanCache(): Promise<void> {
  const client = getJikanClient();
  await client.clearCache();
}

/**
 * Clear specific cache entry
 */
export async function clearJikanCacheEntry(key: string): Promise<void> {
  const client = getJikanClient();
  await client.clearCacheEntry(key);
}

export const jikan = getJikanClient();
