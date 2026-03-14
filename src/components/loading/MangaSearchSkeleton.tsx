import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/Separator";
import { PageContainer, ContentSection } from "@/components/layout/PageContainer";

/**
 * Skeleton loader for manga search results
 * Matches the MangaList card design exactly
 */
export default function MangaSearchSkeleton() {
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

        {/* Search results list */}
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="p-4 border border-border rounded-lg">
              <div className="flex items-start space-x-4">
                {/* Image - 16x24 */}
                <Skeleton className="shrink-0 w-16 h-24 rounded-lg" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Title */}
                  <Skeleton className="h-4 w-3/4" />

                  {/* Info section with proper spacing */}
                  <div className="mt-2 space-y-1">
                    {/* Type and chapters */}
                    <Skeleton className="h-3 w-36" />

                    {/* Score with star icon */}
                    <Skeleton className="h-3 w-16" />

                    {/* Status */}
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-20" />
        </div>
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

export { MangaSearchSkeleton };
