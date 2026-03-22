import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";

interface ItemGridSkeletonProps {
  viewPref?: "grid" | "list" | null;
  count?: number;
  showPagination?: boolean;
}

export function GridCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-3/4 w-full rounded-md" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

export function ListCardSkeleton() {
  return (
    <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
      <Skeleton className="w-16 h-24 rounded-lg shrink-0" />
      <div className="flex-1 space-y-3 py-1">
        <Skeleton className="h-5 w-3/4 max-w-[300px]" />
        <Skeleton className="h-4 w-1/2 max-w-[200px]" />
        <Skeleton className="h-4 w-1/4 max-w-[100px]" />
      </div>
    </div>
  );
}

export function ItemGridSkeleton({ viewPref = "grid", count = 24, showPagination = true }: ItemGridSkeletonProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
         <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {viewPref === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <GridCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <ListCardSkeleton key={i} />
          ))}
        </div>
      )}

      {showPagination && (
        <>
          <Separator className="my-8" />
          <div className="flex justify-center items-center gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-20" />
          </div>
        </>
      )}
    </div>
  );
}
