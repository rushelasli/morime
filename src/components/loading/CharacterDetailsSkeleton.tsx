import { Skeleton } from "@/components/ui/Skeleton";
import { PageContainer, ContentSection } from "@/components/layout/PageContainer";

export default function CharacterDetailsSkeleton() {
  return (
    <>
      <section className="w-full min-h-100 md:min-h-125 lg:min-h-150 relative overflow-hidden bg-linear-to-b from-background/60 via-background/80 to-background">
        <div className="absolute inset-0">
          <Skeleton className="h-full w-full opacity-25" />
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-linear-to-r from-background/90 to-transparent" />

        <PageContainer noPaddingY className="h-full relative z-10">
          <div className="flex h-full items-end pb-8 md:pb-10 pt-20 sm:pt-24">
            <div className="flex flex-col sm:flex-row w-full gap-5 sm:gap-8 items-center sm:items-start md:items-end">
              <div className="flex flex-col items-center gap-2">
                <div className="h-45 w-32.5 sm:h-52.5 sm:w-37.5 lg:h-62.5 lg:w-45 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.3)] shrink-0 -mt-14 sm:-mt-18 md:-mt-24 sm:mb-0 ring-2 ring-white/10 bg-card transform transition-all duration-300">
                  <Skeleton className="h-full w-full" />
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left max-w-full">
                <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 mb-2 sm:mb-3">
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>

                <Skeleton className="h-6 sm:h-7 md:h-8 lg:h-10 w-4/5 mx-auto sm:mx-0 mb-1 sm:mb-2" />
                <Skeleton className="h-4 sm:h-5 w-3/5 mx-auto sm:mx-0 mb-4" />

                <div className="flex flex-wrap justify-center sm:justify-start gap-y-2 gap-x-3 mt-3 mb-4">
                  <div className="flex items-center bg-card/60 backdrop-blur-md border border-white/5 rounded-full px-3 py-1">
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-4">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`bg-card/40 backdrop-blur-sm rounded-lg p-3 border border-border/20 flex flex-col items-center justify-center ${i === 3 ? "col-span-2 sm:col-span-1" : ""}`}
                    >
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-5 sm:h-6 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <ContentSection className="mt-0 md:-mt-24 lg:-mt-48 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="py-0 shadow-lg border-border/40 rounded-xl bg-card">
              <div className="p-4 space-y-0 divide-y divide-border/60">
                <div className="py-3">
                  <Skeleton className="h-4 w-32 mb-1.5" />
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm py-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between text-sm py-1.5 mt-2">
                      <Skeleton className="h-3 w-20" />
                      <div className="flex gap-1.5">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-3">
                  <Skeleton className="h-4 w-20 mb-1.5" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm py-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>

                <div className="py-3">
                  <Skeleton className="h-4 w-24 mb-1.5" />
                  <div className="space-y-2 mt-2">
                    <Skeleton className="h-8 w-full rounded-md" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6 sm:space-y-8">
              <div className="shadow-lg border-border/40 rounded-xl bg-card">
                <div className="-mt-2 -mb-4 p-5 pb-1">
                  <div className="flex items-center gap-2 text-lg sm:text-xl">
                    <span className="w-1.5 h-5 bg-primary rounded-full mr-1.5"></span>
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <div className="p-5 pt-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>

              <div className="shadow-lg border-border/40 rounded-xl bg-card">
                <div className="-mt-2 -mb-4 p-5 pb-1">
                  <div className="flex items-center justify-between text-lg sm:text-xl">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-primary rounded-full mr-1.5"></span>
                      <Skeleton className="h-6 w-48" />
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-4">
                  <div className="grid w-full grid-cols-1 md:grid-cols-1 h-auto md:h-10 gap-1 space-x-0 md:gap-0 p-1 md:p-0 mb-6 bg-foreground/10 md:bg-card rounded-md">
                    <div className="md:hidden space-y-1">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="w-full h-10 rounded-md bg-foreground/10" />
                      ))}
                    </div>
                    <Skeleton className="hidden md:block w-full h-10 rounded-md bg-foreground/10" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-card border border-border/40">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Skeleton className="w-12 h-16 rounded-md shrink-0" />
                            <div className="flex-1 min-w-0 space-y-1">
                              <Skeleton className="h-4 w-full max-w-[150px]" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}

export { CharacterDetailsSkeleton };