import { Skeleton } from "@/components/ui/Skeleton";
import { PageContainer, ContentSection } from "@/components/layout/PageContainer";
import { ItemGridSkeleton } from "@/components/loading/ItemGridSkeleton";

interface AnimeSearchSkeletonProps {
  viewPref?: "grid" | "list" | null;
}

export default function AnimeSearchSkeleton({ viewPref = "grid" }: AnimeSearchSkeletonProps) {
  return (
    <>
      <PageContainer as="section">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        <ItemGridSkeleton viewPref={viewPref} count={12} />
      </PageContainer>

      {/* Genre filters */}
      <ContentSection>
        <div className="flex items-center justify-center flex-wrap gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded" />
          ))}
        </div>
      </ContentSection>
    </>
  );
}

export { AnimeSearchSkeleton };
