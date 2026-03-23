import { getTopAnime } from "@/hooks/useAnime";
import { AnimeGrid } from "@/components/display/anime/AnimeGrid";
import { getSfwCookie, getViewPreferenceCookie } from "@/actions/CookieActions";
import type { Anime as JikanAnime } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";
import type { TopAnimePageProps } from "@/types/pages";

export default async function TopAnimePage({ params, searchParams }: TopAnimePageProps) {
  const viewPref = await getViewPreferenceCookie("anime-display");
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const type = resolvedParams?.type?.[0] || "all";
  const currentPage = parseInt(resolvedSearchParams?.page) || 1;
  const isSfw = await getSfwCookie();
  const apiConfig: any = { limit: 24, sfw: isSfw };

  if (["tv", "movie", "ova", "ona", "special"].includes(type)) {
    apiConfig.type = type;
  } else if (["airing", "upcoming", "bypopularity", "favorite"].includes(type)) {
    apiConfig.filter = type;
  }

  const animeData = await getTopAnime(currentPage, apiConfig);

  const topAnimeData = animeData
    ? {
        data:
          animeData.data?.map((anime: JikanAnime) => ({
            mal_id: anime.mal_id,
            title: getTitle(anime.titles),
            imageUrl: anime.images?.webp?.large_image_url,
            score: anime.score,
            episodes: anime.episodes,
            year: anime.year,
            type: anime.type,
            members: anime.members,
            favorites: anime.favorites,
          })) || [],
        totalPages: animeData.totalPages,
      }
    : null;

  return (
    <AnimeGrid
      initialView={viewPref ?? "grid"}
      animeData={topAnimeData}
      currentPage={currentPage}
      basePath={type === "all" ? "/anime/top" : `/anime/top/${type}`}
      queryParams={{}}
    />
  );
}
