import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { ProducerDetails } from "@/components/producer/ProducerDetails";
import { getProducerById, getProducerAnime } from "@/hooks/useProducer";
import { getSfwCookie, getViewPreferenceCookie } from "@/actions/CookieActions";
import type { Anime as JikanAnime } from "@rushelasli/jikants";
import { getTitle } from "@/lib/utils/TitleExtractor";
import type { PagePropsWithBoth, MalIdParams, BaseSearchParams } from "@/types/pages";

export const metadata: Metadata = {
  title: "Producer Details",
  description: "View producer and studio details",
};

export default async function ProducerDetailsPage({
  params,
  searchParams,
}: PagePropsWithBoth<MalIdParams, BaseSearchParams>) {
  const viewPref = await getViewPreferenceCookie("anime-display");
  const { malId } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");

  if (isNaN(Number(malId))) {
    notFound();
  }

  try {
    const isSfw = await getSfwCookie();

    const [producerData, animeData] = await Promise.all([
      getProducerById(Number(malId)),
      getProducerAnime(Number(malId), currentPage, 24, isSfw),
    ]);

    const animeListData = animeData
      ? {
          data:
            animeData.data?.map((anime: JikanAnime) => ({
              mal_id: anime.mal_id,
              title: getTitle(anime.titles),
              imageUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
              score: anime.score,
              episodes: anime.episodes,
              year: anime.year,
              type: anime.type,
              members: anime.members,
              favorites: anime.favorites,
            })) || [],
          totalPages: animeData.totalPages,
        }
      : null;

    return (
      <PageContainer>
        <PageHeader title={producerData.name} description="Producer and studio information" />
        <ProducerDetails
          producer={producerData}
          animes={animeListData}
          currentPage={currentPage}
          initialView={viewPref ?? "grid"}
        />
      </PageContainer>
    );
  } catch (error) {
    console.error(`Error loading producer details for ID ${malId}:`, error);
    notFound();
  }
}
