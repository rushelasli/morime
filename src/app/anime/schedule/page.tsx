import type { Metadata } from "next";
import { getSchedules } from "@/hooks/useSchedule";
import { AnimeGrid } from "@/components/display/anime/AnimeGrid";
import { DayFilterTabs } from "@/components/forms/DayFilterTabs";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { notFound } from "next/navigation";
import type { SchedulePageProps } from "@/types/pages";
import { getSfwCookie } from "@/actions/CookieActions";
import type { Anime as JikanAnime } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";

export async function generateMetadata({
  searchParams,
}: SchedulePageProps): Promise<Metadata> {
  const currentPage = parseInt((await searchParams)?.page) || 1;
  const title =
    currentPage > 1 ? `Anime Schedule - Page ${currentPage}` : "Anime Schedule";

  return {
    title,
    description:
      "Weekly anime schedule - Find out when your favorite anime episodes air",
  };
}

export default async function Page({ searchParams }: SchedulePageProps) {
  const dayFilter = (await searchParams)?.day || "monday";

  if (
    ![
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
      "other",
      "unknown",
    ].includes(dayFilter.toLowerCase())
  ) {
    notFound();
  }

  const currentPage = parseInt((await searchParams)?.page) || 1;
  const isSfw = await getSfwCookie();

  const apiConfig = {
    limit: 24,
    filter: dayFilter,
    sfw: isSfw,
  };

  const animeScheduleData = await getSchedules(currentPage, apiConfig);

  const animeData = animeScheduleData
    ? {
        data:
          animeScheduleData.data?.map((anime: JikanAnime) => ({
            mal_id: anime.mal_id,
            title: getTitle(anime.titles),
            imageUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
            score: anime.score,
            episodes: anime.episodes,
            year: anime.year,
            type: anime.type,
            members: anime.members,
          })) || [],
        totalPages: animeScheduleData.totalPages,
      }
    : null;

  return (
    <PageContainer as="section">
      <PageHeader
        title="Anime Schedule"
        description="Weekly anime schedule - Find out when your favorite anime episodes air"
      />

      <DayFilterTabs dayFilter={dayFilter} />

      <AnimeGrid
        animeData={animeData}
        currentPage={currentPage}
        basePath="/anime/schedule"
        queryParams={{
          ...(dayFilter && { day: dayFilter }),
        }}
      />
    </PageContainer>
  );
}