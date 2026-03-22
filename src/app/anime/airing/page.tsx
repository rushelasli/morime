import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { AnimeGrid } from "@/components/display/anime/AnimeGrid";
import { getAnime } from "@/hooks/useAnime";
import { getSfwCookie, getViewPreferenceCookie } from "@/actions/CookieActions";
import type { Anime as JikanAnime } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";
import type { ListPageProps } from "@/types/pages";

export const metadata: Metadata = {
  title: "Airing Anime",
  description: "Browse currently airing anime series",
};

export default async function AiringAnimePage({ searchParams }: ListPageProps) {
  const viewPref = await getViewPreferenceCookie("anime-display");
  const { page, type } = await searchParams;
  const currentPage = parseInt(page || "1");
  const isSfw = await getSfwCookie();

  const animeData = await getAnime(currentPage, {
    status: "airing",
    type,
    limit: 24,
    order_by: "members",
    sort: "desc",
    sfw: isSfw,
  });

  const animeListData = animeData
    ? {
        data:
          animeData.data?.map((anime: JikanAnime) => ({
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
        totalPages: animeData.totalPages,
      }
    : null;

  return (
    <PageContainer>
      <PageHeader title="Airing Anime" description="Currently airing anime series" />
      <AnimeGrid initialView={viewPref ?? "grid"}
        animeData={animeListData}
        currentPage={currentPage}
        basePath="/anime/airing"
        queryParams={type ? { type } : {}}
      />
    </PageContainer>
  );
}
