import type { Metadata } from "next";
import { getDetailAnime, getEpisodeAnime, getAnimeCharacters } from "@/hooks/useAnime";
import { notFound } from "next/navigation";
import { ContentSection } from "@/components/layout/PageContainer";
import { AnimeHeroSection } from "@/components/anime/detail/sections/HeroSection";
import { AnimeSidebar } from "@/components/anime/detail/sections/Sidebar";
import { AnimeContentSections } from "@/components/anime/detail/sections/ContentSections";
import { getTitle, getEnglishTitle, getJapaneseTitle, getTitleSynonyms } from "@/lib/utils/TitleExtractor";
import type { DetailPageProps } from "@/types/pages";

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { malId } = await params;

  if (isNaN(Number(malId))) {
    return {
      title: "Anime Not Found | Morime",
    };
  }

  try {
    const animeData = await getDetailAnime(Number(malId));

    const title = getTitle(animeData.titles);
    
    return {
      title: `${title} | Morime`,
      description:
        animeData.synopsis?.slice(0, 160) || "View anime details on Morime",
      openGraph: {
        title: title,
        description: animeData.synopsis?.slice(0, 160),
        images: animeData.images?.webp?.image_url
          ? [animeData.images.webp.image_url]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Anime Details | Morime",
      description: "View anime details on Morime",
    };
  }
}

export default async function AnimeDetailPage({ params }: DetailPageProps) {
  const { malId } = await params;

  if (isNaN(Number(malId))) {
    notFound();
  }

  try {
    const [animeData, episodesData, charactersData] = await Promise.all([
      getDetailAnime(Number(malId)),
      getEpisodeAnime(Number(malId)),
      getAnimeCharacters(Number(malId)),
    ]);

    if (!animeData) {
      notFound();
    }

    const heroData = {
      imageUrl: animeData.images?.webp?.large_image_url,
      title: getTitle(animeData.titles),
      titleEnglish: getEnglishTitle(animeData.titles),
      titleJapanese: getJapaneseTitle(animeData.titles),
      titleSynonyms: getTitleSynonyms(animeData.titles),
      type: animeData.type,
      status: animeData.status,
      score: animeData.score,
      scoredBy: animeData.scored_by,
      rank: animeData.rank,
      popularity: animeData.popularity,
      members: animeData.members,
      season: animeData.season,
      year: animeData.year,
      studios: animeData.studios,
      schedules: animeData.broadcast?.day,
    };

    const sidebarData = {
      titleJapanese: getJapaneseTitle(animeData.titles),
      titleSynonyms: getTitleSynonyms(animeData.titles),
      status: animeData.status,
      episodes: animeData.episodes,
      rating: animeData.rating,
      season: animeData.season,
      year: animeData.year,
      aired: animeData.aired,
      duration: animeData.duration,
      broadcast: animeData.broadcast,
      studios: animeData.studios,
      producers: animeData.producers,
      licensors: animeData.licensors,
      source: animeData.source,
      genres: animeData.genres,
      themes: animeData.themes,
      demographics: animeData.demographics,
      rank: animeData.rank,
      popularity: animeData.popularity,
      members: animeData.members,
      favorites: animeData.favorites,
    };

    const contentData = {
      synopsis: animeData.synopsis,
      trailersData: animeData.trailer,
      charactersData: charactersData,
      themesData: animeData.theme,
      episodesData: episodesData,
      relationsData: animeData.relations,
    };

    return (
      <>
        <AnimeHeroSection heroData={heroData} />
        <ContentSection className="mt-0 md:-mt-24 lg:-mt-48 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <AnimeSidebar sidebarData={sidebarData} />
            </div>
            <div className="lg:col-span-3">
              <AnimeContentSections contentData={contentData} />
            </div>
          </div>
        </ContentSection>
      </>
    );
  } catch (error) {
    console.error("Error loading anime details:", error);
    notFound();
  }
}