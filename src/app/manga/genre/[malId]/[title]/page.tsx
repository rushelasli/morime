import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { MangaGrid } from "@/components/display/manga/MangaGrid";
import { getManga } from "@/hooks/useManga";
import { getSfwCookie, getViewPreferenceCookie } from "@/actions/CookieActions";
import type { Manga as JikanManga } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";
import type { PagePropsWithBoth, MalIdParams, FilterSearchParams } from "@/types/pages";

export const metadata: Metadata = {
  title: "Manga by Genre",
  description: "Browse manga by genre",
};

export default async function GenreMangaPage({ params, searchParams }: PagePropsWithBoth<MalIdParams, FilterSearchParams>) {
  const viewPref = await getViewPreferenceCookie("manga-display");
  const { malId, title } = await params;
  const { page, type } = await searchParams;
  const currentPage = parseInt(page || "1");
  const genreName = title.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const isSfw = await getSfwCookie();

  const mangaData = await getManga(currentPage, {
    genres: malId,
    type,
    limit: 24,
    order_by: "members",
    sort: "desc",
    sfw: isSfw,
  });

  const mangaListData = mangaData
    ? {
        data:
          mangaData.data?.map((manga: JikanManga) => ({
            mal_id: manga.mal_id,
            title: getTitle(manga.titles),
            imageUrl: manga.images?.webp?.large_image_url || manga.images?.jpg?.large_image_url,
            score: manga.score,
            chapters: manga.chapters,
            volumes: manga.volumes,
            type: manga.type,
            members: manga.members,
            favorites: manga.favorites,
          })) || [],
        totalPages: mangaData.totalPages,
      }
    : null;

  return (
    <PageContainer>
      <PageHeader title={`${genreName} Manga`} description={`Browse manga in the ${genreName} genre`} />
      <MangaGrid
        initialView={viewPref ?? "grid"}
        mangaData={mangaListData}
        currentPage={currentPage}
        basePath={`/manga/genre/${malId}/${title}`}
        queryParams={type ? { type } : {}}
      />
    </PageContainer>
  );
}
