import { MangaGrid } from "@/components/display/manga/MangaGrid";

interface MangaSearchResultsProps {
  mangaListData: {
    data: Array<{
      mal_id: number;
      title: string;
      imageUrl: string;
      score: number;
      chapters: number;
      volumes: number;
      type: string;
      members: number;
    }>;
    totalPages: number;
  } | null;
  currentPage: number;
  searchQuery: string;
  initialView?: "grid" | "list";
}

export function MangaSearchResults({
  mangaListData,
  currentPage,
  searchQuery,
  initialView = "grid",
}: MangaSearchResultsProps) {
  return (
    <MangaGrid
      mangaData={mangaListData}
      currentPage={currentPage}
      basePath="/manga"
      queryParams={{
        ...(searchQuery && { q: searchQuery }),
      }}
      initialView={initialView}
    />
  );
}
