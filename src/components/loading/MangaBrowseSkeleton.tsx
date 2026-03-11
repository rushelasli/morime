import { Skeleton } from "@/components/ui/Skeleton";
import { PageContainer, ContentSection } from "@/components/layout/PageContainer";

/**
 * Skeleton loader for manga browse/filter page
 * Shows genre categories layout without search results
 */
export default function MangaBrowseSkeleton() {
  return (
    <>
      <PageContainer as="section">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Genre categories */}
        <div className="p-4 space-y-6">
          {/* Genres section */}
          <div className="border border-primary-foreground p-4 rounded-lg">
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex items-center justify-start flex-wrap gap-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded" />
              ))}
            </div>
          </div>

          {/* Explicit Genres section */}
          <div className="border border-primary-foreground p-4 rounded-lg">
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex items-center justify-start flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded" />
              ))}
            </div>
          </div>

          {/* Themes section */}
          <div className="border border-primary-foreground p-4 rounded-lg">
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex items-center justify-start flex-wrap gap-2">
              {Array.from({ length: 51 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded" />
              ))}
            </div>
          </div>

          {/* Demographics section */}
          <div className="border border-primary-foreground p-4 rounded-lg">
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex items-center justify-start flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded" />
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export { MangaBrowseSkeleton };