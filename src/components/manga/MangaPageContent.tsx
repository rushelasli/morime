import { getManga, getMangaGenresList } from "@/hooks/useManga";
import { searchManga } from "@/hooks/useManga";
import { SearchInput } from "@/components/forms/SearchInput";
import { GenreGrid } from "@/components/display/manga/GenreGrid";
import { GenreCategories } from "@/components/display/manga/GenreCategories";
import { MangaSearchResults } from "@/components/manga/MangaSearchResults";
import { PageContainer, PageHeader, ContentSection } from "@/components/layout/PageContainer";
import { getSfwCookie } from "@/actions/CookieActions";
import type { Manga as JikanManga } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";

interface MangaPageContentProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
}

export default async function MangaPageContent({ searchParams }: MangaPageContentProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page) || 1;
  const searchQuery = resolvedSearchParams?.q || "";
  const isSfw = await getSfwCookie();
  const genresList = await getMangaGenresList();

  let mangaData: {
    data: JikanManga[];
    totalPages?: number;
    total?: number;
  } | null = null;

  if (searchQuery) {
    mangaData = await searchManga(searchQuery, currentPage, 24, isSfw);
  } else {
    const apiConfig = {
      limit: 24,
      order_by: "favorites",
      sort: "desc",
      sfw: isSfw,
    };
    mangaData = await getManga(currentPage, apiConfig);
  }

  const mangaListData = mangaData
    ? {
        data:
          mangaData.data?.map((manga: JikanManga) => ({
            mal_id: manga.mal_id,
            title: getTitle(manga.titles),
            imageUrl: manga.images?.webp?.large_image_url,
            score: manga.score,
            chapters: manga.chapters,
            volumes: manga.volumes,
            type: manga.type,
            members: manga.members,
          })) || [],
        totalPages: mangaData.totalPages || Math.ceil((mangaData.total || 0) / 24),
      }
    : null;

  return (
    <>
      <PageContainer as="section">
        <PageHeader
          title={searchQuery ? `Search: ${searchQuery}` : "Manga List"}
          description={
            searchQuery ? `Search results for "${searchQuery}"` : "Browse all manga series from extensive collection"
          }
        />

        <SearchInput defaultValue={searchQuery} basePath="/manga" placeholder="Search manga titles..." autoFocus={true} />

        {searchQuery ? (
          <MangaSearchResults mangaListData={mangaListData} currentPage={currentPage} searchQuery={searchQuery} />
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
