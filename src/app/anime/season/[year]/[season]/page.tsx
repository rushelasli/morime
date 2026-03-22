import type { Metadata } from "next";

import { AnimeGrid } from "@/components/display/anime/AnimeGrid";
import { TypeFilterTabs } from "@/components/forms/TypeFilterTabs";
import { getSeason } from "@/hooks/useSeason";
import { getSfwCookie, getViewPreferenceCookie } from "@/actions/CookieActions";
import type { Anime as JikanAnime } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";
import type { SeasonPageProps } from "@/types/pages";

export async function generateMetadata({ params, searchParams }: SeasonPageProps): Promise<Metadata> {
  const { year, season } = await params;
  const currentPage = parseInt((await searchParams)?.page || "1");
  const title =
    currentPage > 1
      ? `${season.charAt(0).toUpperCase() + season.slice(1)} ${year} Anime - Page ${currentPage}`
      : `${season.charAt(0).toUpperCase() + season.slice(1)} ${year} Anime`;

  return {
    title,
    description: `Anime from ${season} ${year} season`,
  };
}

export default async function SeasonalAnimePage({ params, searchParams }: SeasonPageProps) {
  const viewPref = await getViewPreferenceCookie("anime-display");
  const { year, season } = await params;
  const typeFilter = (await searchParams)?.type || "";
  const currentPage = parseInt((await searchParams)?.page || "1");
  const isSfw = await getSfwCookie();

  const apiConfig = {
    limit: 24,
    type: `seasons/${year}/${season}`,
    ...(typeFilter && { filter: typeFilter }),
    sfw: isSfw,
  };

  const animeSeasonalData = await getSeason(currentPage, apiConfig);

  const animeData = animeSeasonalData
    ? {
        data:
          animeSeasonalData.data?.map((anime: JikanAnime) => ({
            mal_id: anime.mal_id,
            title: getTitle(anime.titles),
            imageUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
            score: anime.score,
            episodes: anime.episodes,
            year: anime.year,
            type: anime.type,
            members: anime.members,
            favorites: anime.favorites,
          })) || [],
        totalPages: animeSeasonalData.totalPages,
      }
    : null;

  return (
    <>
      <TypeFilterTabs typeFilter={typeFilter} basePath={`/anime/season/${year}/${season}`} />

      <AnimeGrid initialView={viewPref ?? "grid"}
        animeData={animeData}
        currentPage={currentPage}
        basePath={`/anime/season/${year}/${season}`}
        queryParams={{
          ...(typeFilter && { type: typeFilter }),
        }}
      />
    </>
  );
}
