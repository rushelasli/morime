import { Skeleton } from "@/components/ui/Skeleton";
import { PageContainer } from "@/components/layout/PageContainer";
import { Separator } from "@/components/ui/Separator";

interface ProducersPageSkeletonProps {
  showSearch?: boolean;
  viewPref?: "grid" | "list" | null;
}

function ProducerListCardSkeleton() {
  return (
    <div className="p-4 border border-border rounded-lg">
      <div className="flex items-start space-x-4">
        <Skeleton className="w-16 h-24 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

function ProducerGridCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-3/4 w-full rounded-md" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-2/3 mx-auto" />
    </div>
  );
}

export default function ProducersPageSkeleton({ showSearch = true, viewPref = "list" }: ProducersPageSkeletonProps) {
  return (
    <PageContainer as="section">
      <div className="text-center space-y-2 mb-8">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      {showSearch && (
        <div className="mb-8">
          <Skeleton className="h-10 w-full max-w-md mx-auto" />
        </div>
      )}

      <div className="flex justify-end mb-4">
         <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      <div className={
        viewPref === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      }>
        {[...Array(24)].map((_, i) => (
          viewPref === "grid" ? <ProducerGridCardSkeleton key={i} /> : <ProducerListCardSkeleton key={i} />
        ))}
      </div>

      <Separator className="my-8" />

      <div className="flex justify-center items-center gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-20" />
      </div>
    </PageContainer>
  );
}

export { ProducersPageSkeleton };
