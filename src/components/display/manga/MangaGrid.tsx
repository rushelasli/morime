"use client";

import { MangaCard } from "@/components/display/manga/MangaCard";
import { MangaList } from "@/components/display/manga/MangaList";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import { useViewToggle } from "@/hooks/useViewToggle";
import { ViewToggle } from "@/components/ui/ViewToggle";
import type { MangaCardData } from "@/types/components";

interface MangaGridProps {
  mangaData: {
    data: MangaCardData[];
    totalPages?: number;
  } | null;
  currentPage: number;
  basePath: string;
  queryParams?: Record<string, string>;
  initialView?: "grid" | "list";
}

export function MangaGrid({ mangaData, currentPage, basePath, queryParams, initialView = "grid" }: MangaGridProps) {
  const { view, toggleView } = useViewToggle("manga-display", initialView);

  if (!mangaData || !mangaData.data || mangaData.data.length === 0) {
    return <EmptyState type="manga" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <ViewToggle view={view} onToggle={toggleView} />
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mangaData.data.map((manga, i) => (
            <MangaCard key={`${manga.mal_id}-${i}`} manga={manga} priority={i < 24} />
          ))}
        </div>
      ) : (
        <div className="mt-0">
          <MangaList mangaData={mangaData} currentPage={currentPage} basePath={basePath} queryParams={queryParams} />
        </div>
      )}

      <Separator className="my-8" />

      <MorimePagination
        currentPage={currentPage}
        totalPages={mangaData.totalPages || 1}
        basePath={basePath}
        queryParams={queryParams}
      />
    </div>
  );
}
