import type { Anime as JikanAnime } from "@rushelasli/jikants";
import HomePage from "@/components/anime/home/HomePage";
import { getTopAnime, getAnimeGenresList } from "@/hooks/useAnime";
import { getSeason } from "@/hooks/useSeason";
import { getSfwCookie } from "@/actions/CookieActions";
import { Suspense, cache } from "react";
import { HomePageSkeleton } from "@/components/loading/HomePageSkeleton";
import { getTitle, getJapaneseTitle } from "@/lib/utils/TitleExtractor";

const getCachedUpcoming = cache(async (sfw: boolean) => {
  return await getSeason(1, { type: "seasons/upcoming", limit: 6, sfw });
});

const getCachedTopAnime = cache(async (sfw: boolean) => {
  return await getTopAnime(1, { limit: 20, sfw });
});

const getCachedCurrentSeason = cache(async (sfw: boolean) => {
  return await getSeason(1, { type: "seasons/now", limit: 20, sfw });
});

const getCachedGenres = cache(async () => {
  return await getAnimeGenresList();
});

export default async function Home() {
  const isSfw = await getSfwCookie();

  const upcomings = await getCachedUpcoming(isSfw);
  const topAnimes = await getCachedTopAnime(isSfw);
  const animes = await getCachedCurrentSeason(isSfw);
  const genresList = await getCachedGenres();

  const upcomingData =
    upcomings.data?.map((anime: JikanAnime) => ({
      mal_id: anime.mal_id,
      title: getTitle(anime.titles),
      title_japanese: getJapaneseTitle(anime.titles),
      status: anime.status,
      genres: anime.genres?.slice(0, 3),
      imageUrl: anime.images?.webp?.large_image_url,
      trailerUrl: anime.trailer?.embed_url,
    })) || [];

  const topAnimeData =
    topAnimes.data?.map((anime: JikanAnime) => ({
      mal_id: anime.mal_id,
      title: getTitle(anime.titles),
      imageUrl: anime.images?.webp?.large_image_url,
      score: anime.score,
      episodes: anime.episodes,
      year: anime.year,
      type: anime.type,
            members: anime.members,
            favorites: anime.favorites,
    })) || [];

  const currentAnimeData =
    animes.data?.map((anime: JikanAnime) => ({
      mal_id: anime.mal_id,
      title: getTitle(anime.titles),
      imageUrl: anime.images?.webp?.large_image_url,
      score: anime.score,
      episodes: anime.episodes,
      year: anime.year,
      type: anime.type,
            members: anime.members,
            favorites: anime.favorites,
    })) || [];

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePage upcomings={upcomingData} topAnimes={topAnimeData} animes={currentAnimeData} genresList={genresList} />
    </Suspense>
  );
}
