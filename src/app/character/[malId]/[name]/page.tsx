import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentSection } from "@/components/layout/PageContainer";
import { CharacterHeroSection } from "@/components/character/detail/sections/HeroSection";
import { CharacterSidebar } from "@/components/character/detail/sections/Sidebar";
import { CharacterContentSections } from "@/components/character/detail/sections/ContentSections";
import { getCharacterById } from "@/hooks/useCharacter";
import type { DetailPageProps, MalIdParams } from "@/types/pages";

export async function generateMetadata({ params }: { params: Promise<MalIdParams> }): Promise<Metadata> {
  const { malId } = await params;

  if (isNaN(Number(malId))) {
    return {
      title: "Character Not Found",
    };
  }

  try {
    const characterData = await getCharacterById(Number(malId));

    return {
      title: characterData.name,
      description: characterData.about?.slice(0, 160) || "View character details on Morime",
      openGraph: {
        title: characterData.name,
        description: characterData.about?.slice(0, 160),
        images: characterData.imageUrl ? [characterData.imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Character Details",
      description: "View character details on Morime",
    };
  }
}

export default async function CharacterDetailPage({ params }: DetailPageProps) {
  const { malId } = await params;

  if (isNaN(Number(malId))) {
    notFound();
  }

  try {
    const characterData = await getCharacterById(Number(malId));

    if (!characterData) {
      notFound();
    }

    const heroData = {
      imageUrl: characterData.imageUrl,
      name: characterData.name,
      nameKanji: characterData.name_kanji,
      nicknames: characterData.nicknames,
      favorites: characterData.favorites,
      animeCount: characterData.anime?.length || 0,
      mangaCount: characterData.manga?.length || 0,
      voiceActorCount: characterData.voices?.length || 0,
    };

    const sidebarData = {
      name: characterData.name,
      nameKanji: characterData.name_kanji,
      nicknames: characterData.nicknames,
      favorites: characterData.favorites,
      url: characterData.url,
    };

    const contentData = {
      about: characterData.about,
      animeData: { data: characterData.anime || [] },
      mangaData: { data: characterData.manga || [] },
      voicesData: { data: characterData.voices || [] },
    };

    return (
      <>
        <CharacterHeroSection heroData={heroData} />
        <ContentSection className="mt-0 md:-mt-24 lg:-mt-48 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <CharacterSidebar sidebarData={sidebarData} />
            </div>
            <div className="lg:col-span-3">
              <CharacterContentSections contentData={contentData} />
            </div>
          </div>
        </ContentSection>
      </>
    );
  } catch (error) {
    console.error("Error loading character details:", error);
    notFound();
  }
}
