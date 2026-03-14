import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";

export default function ProducerDetailsSkeleton() {
  return (
    <PageContainer>
      {/* Page Header Skeleton */}
      <div className="mb-8 text-center space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Producer Info Card */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Producer Image */}
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg mx-auto sm:mx-0" />

              {/* Producer Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left space-y-3 w-full">
                <Skeleton className="h-8 sm:h-10 w-48 mx-auto sm:mx-0" />

                <div className="flex justify-center sm:justify-start gap-2">
                  <Skeleton className="h-6 w-32" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto sm:mx-0" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center p-3 sm:p-4 border rounded-lg">
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Produced Anime Card */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-2/3 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-8 flex justify-center items-center gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export { ProducerDetailsSkeleton };
