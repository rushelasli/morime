import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { AnimeGrid } from "@/components/display/anime/AnimeGrid";
import { getAnime } from "@/hooks/useAnime";
import { getSfwCookie } from "@/actions/CookieActions";
import type { Anime as JikanAnime } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";

export const metadata: Metadata = {
  title: "Anime by Genre | Morime",
  description: "Browse anime by genre",
};

interface PageProps {
  params: Promise<{
    malId: string;
    title: string;
  }>;
  searchParams: Promise<{
    page?: string;
    type?: string;
  }>;
}

export default async function GenreAnimePage({ params, searchParams }: PageProps) {
  const { malId, title } = await params;
  const { page, type } = await searchParams;
  const currentPage = parseInt(page || "1");
  const genreName = title.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const isSfw = await getSfwCookie();

  const animeData = await getAnime(currentPage, {
    genres: malId,
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
          })) || [],
        totalPages: animeData.totalPages,
      }
    : null;

  return (
    <PageContainer>
      <PageHeader
        title={`${genreName} Anime`}
        description={`Browse anime in the ${genreName} genre`}
      />
      <AnimeGrid
        animeData={animeListData}
        currentPage={currentPage}
        basePath={`/anime/genre/${malId}/${title}`}
        queryParams={type ? { type } : {}}
      />
    </PageContainer>
  );
}