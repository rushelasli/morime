import { JikanClient } from "@rushelasli/jikants";

const jikanClient = new JikanClient({
  cacheOptions: {
    ttl: 1000 * 60 * 60 * 24, // 24 hours cache
  },
  enableLogging: process.env.NODE_ENV === "development",
});

export { jikanClient };

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

export async function clearJikanCache() {
  await jikanClient.clearCache();
}

export async function clearJikanCacheEntry(endpoint: string) {
  await jikanClient.clearCacheEntry(endpoint);
}
