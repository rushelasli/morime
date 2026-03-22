import { Skeleton } from "@/components/ui/Skeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import { ItemGridSkeleton } from "@/components/loading/ItemGridSkeleton";

interface ScheduleSkeletonProps {
  viewPref?: "grid" | "list" | null;
}

export function ScheduleSkeleton({ viewPref = "grid" }: ScheduleSkeletonProps) {
  return (
    <PageContainer as="section">
      <div className="text-center space-y-2 mb-8">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      <div className="mb-4">
        <div className="hidden md:flex h-10 gap-1 px-1.5 py-1 mx-auto w-fit">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20" />
          ))}
        </div>

        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max px-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 shrink-0" />
            ))}
          </div>
        </div>
      </div>

      <ItemGridSkeleton viewPref={viewPref} count={24} />
    </PageContainer>
  );
}
