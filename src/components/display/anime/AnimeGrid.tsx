"use client";

import { AnimeCard } from "@/components/display/anime/AnimeCard";
import { AnimeList } from "@/components/display/anime/AnimeList";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import { useViewToggle } from "@/hooks/useViewToggle";
import { ViewToggle } from "@/components/ui/ViewToggle";
import type { AnimeCardData } from "@/types/components";

interface AnimeGridProps {
  animeData: {
    data: AnimeCardData[];
    totalPages?: number;
  } | null;
  currentPage: number;
  basePath: string;
  queryParams?: Record<string, string>;
  initialView?: "grid" | "list";
}

export function AnimeGrid({ animeData, currentPage, basePath, queryParams, initialView = "grid" }: AnimeGridProps) {
  const { view, toggleView } = useViewToggle("anime-display", initialView);

  if (!animeData || !animeData.data || animeData.data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <ViewToggle view={view} onToggle={toggleView} />
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {animeData.data.map((anime, i) => (
            <AnimeCard key={`${anime.mal_id}-${i}`} anime={anime} priority={i < 24} />
          ))}
        </div>
      ) : (
        <div className="mt-0">
          <AnimeList animeData={animeData} currentPage={currentPage} basePath={basePath} queryParams={queryParams} />
        </div>
      )}

      <Separator className="my-8" />

      <MorimePagination
        currentPage={currentPage}
        totalPages={animeData.totalPages || 1}
        basePath={basePath}
        queryParams={queryParams}
      />
    </div>
  );
}
