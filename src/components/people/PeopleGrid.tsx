import { PersonCard } from "@/components/people/PersonCard";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import type { Person } from "@/types/people";

interface PeopleGridProps {
  peopleData: {
    data: Person[];
    totalPages?: number;
  } | null;
  currentPage: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export function PeopleGrid({ peopleData, currentPage, basePath, queryParams }: PeopleGridProps) {
  if (!peopleData || !peopleData.data || peopleData.data.length === 0) {
    return <EmptyState message="No people found" />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {peopleData.data.map(person => (
          <PersonCard key={person.mal_id} person={person} />
        ))}
      </div>

      <Separator className="my-8" />

      <MorimePagination
        currentPage={currentPage}
        totalPages={peopleData.totalPages || 1}
        basePath={basePath}
        queryParams={queryParams}
      />
    </div>
  );
}
