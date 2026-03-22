"use client";

import { CharacterCard } from "@/components/character/CharacterCard";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import { useViewToggle } from "@/hooks/useViewToggle";
import { ViewToggle } from "@/components/ui/ViewToggle";
import type { CharacterData } from "@/types/character";

interface CharacterGridProps {
  charactersData: {
    data: CharacterData[];
    totalPages?: number;
  } | null;
  currentPage: number;
  basePath: string;
  queryParams?: Record<string, string>;
  initialView?: "grid" | "list";
}

export function CharacterGrid({ charactersData, currentPage, basePath, queryParams, initialView = "list" }: CharacterGridProps) {
  const { view, toggleView } = useViewToggle("character-display", initialView);

  if (!charactersData || !charactersData.data || charactersData.data.length === 0) {
    return <EmptyState message="No characters found" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <ViewToggle view={view} onToggle={toggleView} />
      </div>

      <div className={
        view === "grid" 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" 
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      }>
        {charactersData.data.map(character => (
          <CharacterCard key={character.mal_id} character={character} view={view} />
        ))}
      </div>

      <Separator className="my-8" />

      <MorimePagination
        currentPage={currentPage}
        totalPages={charactersData.totalPages || 1}
        basePath={basePath}
        queryParams={queryParams}
      />
    </div>
  );
}