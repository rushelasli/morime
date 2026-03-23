import { PageContentProps } from "@/types";
import { getAnimeGenresList, getAnime } from "@/hooks/useAnime";
import type { Anime as JikanAnime } from "@rushelasli/jikants";
import { getSfwCookie, getViewPreferenceCookie } from "@/actions/CookieActions";
import { searchAnime } from "@/hooks/useAnime";
import { getTitle } from "@/lib/utils/TitleExtractor";
import { PageContainer, PageHeader, ContentSection } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/forms/SearchInput";
import { AnimeSearchResults } from "@/components/anime/AnimeSearchResults";
import { GenreCategories } from "@/components/display/anime/GenreCategories";
import { GenreGrid } from "@/components/display/anime/GenreGrid";

export default async function AnimePageContent({ searchParams }: PageContentProps) {
  const viewPref = await getViewPreferenceCookie("anime-display");
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page) || 1;
  const searchQuery = resolvedSearchParams?.q || "";
  const isSfw = await getSfwCookie();
  const genresList = await getAnimeGenresList();

  let animeData: {
    data: JikanAnime[];
    totalPages?: number;
    total?: number;
  } | null = null;

  if (searchQuery) {
    animeData = await searchAnime(searchQuery, currentPage, 24, isSfw);
  } else {
    const apiConfig = {
      limit: 24,
      order_by: "favorites",
      sort: "desc",
      sfw: isSfw,
    };
    animeData = await getAnime(currentPage, apiConfig);
  }

  const animeListData = animeData
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
        totalPages: animeData.totalPages || Math.ceil((animeData.total || 0) / 24),
      }
    : null;

  return (
    <>
      <PageContainer as="section">
        <PageHeader
          title={searchQuery ? `Search: ${searchQuery}` : "Anime List"}
          description={
            searchQuery
              ? `Search results for "${searchQuery}"`
              : "Browse all anime series, movies, and specials from extensive collection"
          }
        />

        <SearchInput defaultValue={searchQuery} basePath="/anime" placeholder="Search anime titles..." autoFocus={true} />

        {searchQuery ? (
          <AnimeSearchResults
            animeListData={animeListData}
            currentPage={currentPage}
            searchQuery={searchQuery}
            initialView={viewPref ?? "grid"}
          />
        ) : (
          <GenreCategories genres={genresList} />
        )}
      </PageContainer>

      {searchQuery && (
        <ContentSection>
          <GenreGrid genres={genresList} />
        </ContentSection>
      )}
    </>
  );
}
