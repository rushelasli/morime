import { CharacterCard } from "@/components/character/CharacterCard";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import type { CharacterData } from "@/types/character";

interface CharacterGridProps {
  charactersData: {
    data: CharacterData[];
    totalPages?: number;
  } | null;
  currentPage: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export function CharacterGrid({ charactersData, currentPage, basePath, queryParams }: CharacterGridProps) {
  if (!charactersData || !charactersData.data || charactersData.data.length === 0) {
    return <EmptyState message="No characters found" />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {charactersData.data.map(character => (
          <CharacterCard key={character.mal_id} character={character} />
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