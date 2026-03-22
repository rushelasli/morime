import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";
import { ItemGridSkeleton } from "@/components/loading/ItemGridSkeleton";

interface AnimeGridSkeletonProps {
  showSeasonNavigation?: boolean;
  viewPref?: "grid" | "list" | null;
}

export default function AnimeGridSkeleton({ showSeasonNavigation = false, viewPref = "grid" }: AnimeGridSkeletonProps) {
  return (
    <>
      {showSeasonNavigation && (
        <div className="mb-6">
          <div className="hidden md:flex items-center justify-center gap-2 mb-4">
            <Skeleton className="h-8 w-8" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
            <Skeleton className="h-8 w-8" />
          </div>

          <div className="md:hidden overflow-x-auto mb-4">
            <div className="flex justify-center gap-2 pb-2 min-w-max px-1">
              <Skeleton className="h-8 w-8 shrink-0" />
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 shrink-0" />
              ))}
              <Skeleton className="h-8 w-8 shrink-0" />
            </div>
          </div>

          <Separator className="my-4" />
        </div>
      )}

      <ItemGridSkeleton viewPref={viewPref} count={24} />
    </>
  );
}

export { AnimeGridSkeleton };
