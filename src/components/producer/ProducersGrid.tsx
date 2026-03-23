"use client";

import { ProducerCard } from "@/components/producer/ProducerCard";
import { Separator } from "@/components/ui/Separator";
import { MorimePagination } from "@/components/navigation/Pagination";
import { EmptyState } from "@/components/content/EmptyState";
import { useViewToggle } from "@/hooks/useViewToggle";
import { ViewToggle } from "@/components/ui/ViewToggle";
import type { ProducerData } from "@/types/anime";

interface ProducersGridProps {
  producersData: {
    data: ProducerData[];
    totalPages?: number;
  } | null;
  currentPage: number;
  basePath: string;
  queryParams?: Record<string, string>;
  initialView?: "grid" | "list";
}

export function ProducersGrid({
  producersData,
  currentPage,
  basePath,
  queryParams,
  initialView = "list",
}: ProducersGridProps) {
  const { view, toggleView } = useViewToggle("producer-display", initialView);

  if (!producersData || !producersData.data || producersData.data.length === 0) {
    return <EmptyState message="No producers found" />;
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
        {producersData.data.map(producer => (
          <ProducerCard key={producer.mal_id} producers={producer} view={view} />
        ))}
      </div>

      <Separator className="my-8" />

      <MorimePagination
        currentPage={currentPage}
        totalPages={producersData.totalPages || 1}
        basePath={basePath}
        queryParams={queryParams}
      />
    </div>
  );
}
