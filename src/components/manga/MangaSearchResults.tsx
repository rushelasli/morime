import { MangaList } from "@/components/display/manga/MangaList";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";

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
}

export function MangaSearchResults({ mangaListData, currentPage, searchQuery }: MangaSearchResultsProps) {
  return (
    <>
      <MangaList
        mangaData={mangaListData}
        currentPage={currentPage}
        basePath="/manga"
        queryParams={{
          ...(searchQuery && { q: searchQuery }),
        }}
      />

      {mangaListData && mangaListData.data && mangaListData.data.length > 0 && (
        <>
          <Separator className="my-8" />
          <MorimePagination
            currentPage={currentPage}
            totalPages={mangaListData.totalPages || 1}
            basePath="/manga"
            queryParams={{
              ...(searchQuery && { q: searchQuery }),
            }}
          />
        </>
      )}
    </>
  );
}
