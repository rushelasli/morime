import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { PageContainer, ContentSection } from "@/components/layout/PageContainer";
import { ItemGridSkeleton } from "@/components/loading/ItemGridSkeleton";

interface GenrePageSkeletonProps {
  viewPref?: "grid" | "list" | null;
}

export default function GenrePageSkeleton({ viewPref = "grid" }: GenrePageSkeletonProps) {
  return (
    <>
      <PageContainer as="section">
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Genre
            </Badge>
          </div>
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        <ItemGridSkeleton viewPref={viewPref} count={24} />
      </PageContainer>

      <ContentSection>
        <div className="border border-primary-foreground p-4 rounded-lg">
          <div className="flex items-center justify-center flex-wrap gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-md" />
            ))}
          </div>
        </div>
      </ContentSection>
    </>
  );
}
