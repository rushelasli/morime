import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { AnimeGrid } from "@/components/display/anime/AnimeGrid";
import { getRecentlyCompletedAnime } from "@/hooks/useAnime";
import { getSfwCookie } from "@/actions/CookieActions";
import type { Anime as JikanAnime } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";

export const metadata: Metadata = {
  title: "Completed Anime | Morime",
  description: "Browse completed anime series",
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    type?: string;
  }>;
}

export default async function CompletedAnimePage({ searchParams }: PageProps) {
  const { page, type } = await searchParams;
  const currentPage = parseInt(page || "1");
  const isSfw = await getSfwCookie();

  const animeData = await getRecentlyCompletedAnime(currentPage, {
    type,
    limit: 24,
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
          })) || [],
        totalPages: animeData.totalPages,
      }
    : null;

  return (
    <PageContainer>
      <PageHeader
        title="Completed Anime"
        description="Browse anime that have finished airing"
      />
      <AnimeGrid
        animeData={animeListData}
        currentPage={currentPage}
        basePath="/anime/completed"
        queryParams={type ? { type } : {}}
      />
    </PageContainer>
  );
}