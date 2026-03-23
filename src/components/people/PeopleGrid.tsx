"use client";

import { PersonCard } from "@/components/people/PersonCard";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import { useViewToggle } from "@/hooks/useViewToggle";
import { ViewToggle } from "@/components/ui/ViewToggle";
import type { Person } from "@/types/people";

interface PeopleGridProps {
  peopleData: {
    data: Person[];
    totalPages?: number;
  } | null;
  currentPage: number;
  basePath: string;
  queryParams?: Record<string, string>;
  initialView?: "grid" | "list";
}

export function PeopleGrid({ peopleData, currentPage, basePath, queryParams, initialView = "list" }: PeopleGridProps) {
  const { view, toggleView } = useViewToggle("people-display", initialView);

  if (!peopleData || !peopleData.data || peopleData.data.length === 0) {
    return <EmptyState message="No people found" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <ViewToggle view={view} onToggle={toggleView} />
      </div>

      <div
        className={
          view === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        }
      >
        {peopleData.data.map(person => (
          <PersonCard key={person.mal_id} person={person} view={view} />
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
