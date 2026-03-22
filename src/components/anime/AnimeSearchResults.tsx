import { AnimeGrid } from "@/components/display/anime/AnimeGrid";

interface AnimeSearchResultsProps {
  animeListData: {
    data: Array<{
      mal_id: number;
      title: string;
      imageUrl: string;
      score: number;
      episodes: number;
      year: number;
      type: string;
      members: number;
    }>;
    totalPages: number;
  } | null;
  currentPage: number;
  searchQuery: string;
  initialView?: "grid" | "list";
}



export function AnimeSearchResults({ animeListData, currentPage, searchQuery, initialView = "grid" }: AnimeSearchResultsProps) {
  return (
    <AnimeGrid
      animeData={animeListData}
      currentPage={currentPage}
      basePath="/anime"
      queryParams={{
        ...(searchQuery && { q: searchQuery }),
      }}
      initialView={initialView}
    />
  );
}
