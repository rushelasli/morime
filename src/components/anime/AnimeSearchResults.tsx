import { AnimeList } from "@/components/display/anime/AnimeList";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";

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
}

export function AnimeSearchResults({
  animeListData,
  currentPage,
  searchQuery,
}: AnimeSearchResultsProps) {
  return (
    <>
      <AnimeList
        animeData={animeListData}
        currentPage={currentPage}
        basePath="/anime"
        queryParams={{
          ...(searchQuery && { q: searchQuery }),
        }}
      />

      {animeListData &&
        animeListData.data &&
        animeListData.data.length > 0 && (
          <>
            <Separator className="my-8" />
            <MorimePagination
              currentPage={currentPage}
              totalPages={animeListData.totalPages || 1}
              basePath="/anime"
              queryParams={{
                ...(searchQuery && { q: searchQuery }),
              }}
            />
          </>
        )}
    </>
  );
}