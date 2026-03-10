import { JikanClient } from '@rushelasli/jikants';

// Create a singleton instance of JikanClient with caching enabled
const jikanClient = new JikanClient({
  cacheOptions: {
    ttl: 1000 * 60 * 60 * 24, // 24 hours cache
  },
  enableLogging: process.env.NODE_ENV === 'development',
});

export { jikanClient };

// Export individual clients for tree-shaking if needed
export const {
  anime: animeClient,
  manga: mangaClient,
  characters: charactersClient,
  people: peopleClient,
  seasons: seasonsClient,
  top: topClient,
  clubs: clubsClient,
  users: usersClient,
  producers: producersClient,
  genres: genresClient,
  recommendations: recommendationsClient,
  reviews: reviewsClient,
  random: randomClient,
  schedules: schedulesClient,
  magazines: magazinesClient,
  watch: watchClient,
} = jikanClient;

// Helper function to clear cache if needed
export async function clearJikanCache() {
  await jikanClient.clearCache();
}

// Helper function to clear specific cache entry
export async function clearJikanCacheEntry(endpoint: string) {
  await jikanClient.clearCacheEntry(endpoint);
}