import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentSection } from "@/components/layout/PageContainer";
import { MangaHeroSection } from "@/components/manga/detail/sections/HeroSection";
import { MangaSidebar } from "@/components/manga/detail/sections/Sidebar";
import { MangaContentSections } from "@/components/manga/detail/sections/ContentSections";
import { getDetailManga, getMangaCharacters } from "@/hooks/useManga";
import { getTitle, getEnglishTitle, getJapaneseTitle, getTitleSynonyms } from "@/lib/utils/TitleExtractor";
import type { DetailPageProps } from "@/types/pages";

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { malId } = await params;

  if (isNaN(Number(malId))) {
    return {
      title: "Manga Not Found | Morime",
    };
  }

  try {
    const manga = await getDetailManga(Number(malId));
    const title = getTitle(manga.titles) || 'Manga Details';
    return {
      title: `${title} | Morime`,
      description: manga.synopsis || "View manga details on Morime",
    };
  } catch (error) {
    return {
      title: "Manga Details | Morime",
      description: "View manga details on Morime",
    };
  }
}

export default async function MangaDetailPage({ params }: DetailPageProps) {
  const { malId } = await params;

  if (isNaN(Number(malId))) {
    notFound();
  }

  try {
    const [manga, characters] = await Promise.all([
      getDetailManga(Number(malId)),
      getMangaCharacters(Number(malId)),
    ]);

    const heroData = {
      imageUrl: manga.images?.jpg?.large_image_url || manga.images?.jpg?.image_url,
      title: getTitle(manga.titles),
      titleEnglish: getEnglishTitle(manga.titles),
      titleJapanese: getJapaneseTitle(manga.titles),
      titleSynonyms: getTitleSynonyms(manga.titles),
      type: manga.type,
      status: manga.status || "Unknown",
      score: manga.score,
      scoredBy: manga.scored_by,
      rank: manga.rank,
      popularity: manga.popularity,
      members: manga.members,
    };

    const sidebarData = {
      titleJapanese: getJapaneseTitle(manga.titles),
      titleSynonyms: getTitleSynonyms(manga.titles),
      status: manga.status || "Unknown",
      chapters: manga.chapters,
      volumes: manga.volumes,
      published: manga.published || { from: null, to: null, prop: { from: {}, to: {} }, string: "" },
      authors: manga.authors || [],
      serializations: manga.serializations || [],
      genres: manga.genres || [],
      themes: manga.themes || [],
      demographics: manga.demographics || [],
      rank: manga.rank,
      popularity: manga.popularity,
      members: manga.members,
      favorites: manga.favorites,
    };

    const contentData = {
      synopsis: manga.synopsis || "No synopsis available.",
      charactersData: characters || [],
      relationsData: manga.relations || [],
    };

    return (
      <>
        <MangaHeroSection heroData={heroData} />
        <ContentSection className="mt-0 md:-mt-24 lg:-mt-48 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <MangaSidebar sidebarData={sidebarData} />
            </div>
            <div className="lg:col-span-3">
              <MangaContentSections contentData={contentData} />
            </div>
          </div>
        </ContentSection>
      </>
    );
  } catch (error) {
    console.error(`Error loading manga details for ID ${malId}:`, error);
    notFound();
  }
}