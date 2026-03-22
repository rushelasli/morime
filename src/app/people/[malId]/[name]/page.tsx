import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentSection } from "@/components/layout/PageContainer";
import { PersonHeroSection } from "@/components/people/detail/sections/HeroSection";
import { PersonSidebar } from "@/components/people/detail/sections/Sidebar";
import { PersonContentSections } from "@/components/people/detail/sections/ContentSections";
import { getPersonById } from "@/hooks/usePeople";
import type { DetailPageProps, MalIdParams } from "@/types/pages";

export async function generateMetadata({ params }: { params: Promise<MalIdParams> }): Promise<Metadata> {
  const { malId } = await params;

  if (isNaN(Number(malId))) {
    return {
      title: "Person Not Found",
    };
  }

  try {
    const personData = await getPersonById(Number(malId));

    return {
      title: personData.name,
      description: personData.about?.slice(0, 160) || "View person details on Morime",
      openGraph: {
        title: personData.name,
        description: personData.about?.slice(0, 160),
        images: personData.imageUrl ? [personData.imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: "Person Details",
      description: "View person details on Morime",
    };
  }
}

export default async function PersonDetailPage({
  params,
}: DetailPageProps) {
  const { malId } = await params;

  if (isNaN(Number(malId))) {
    notFound();
  }

  try {
    const personData = await getPersonById(Number(malId));

    if (!personData) {
      notFound();
    }

    const heroData = {
      imageUrl: personData.imageUrl,
      name: personData.name,
      givenName: personData.given_name,
      familyName: personData.family_name,
      alternateNames: personData.alternate_names,
      birthday: personData.birthday,
      favorites: personData.favorites,
      animeCount: personData.anime?.length || 0,
      voiceCount: personData.voices?.length || 0,
      mangaCount: personData.manga?.length || 0,
    };

    const sidebarData = {
      name: personData.name,
      givenName: personData.given_name,
      familyName: personData.family_name,
      alternateNames: personData.alternate_names,
      birthday: personData.birthday,
      website_url: personData.website_url,
      url: personData.url,
      favorites: personData.favorites,
    };

    const contentData = {
      about: personData.about,
      animeData: { data: personData.anime || [] },
      mangaData: { data: personData.manga || [] },
      voicesData: { data: personData.voices || [] },
    };

    return (
      <>
        <PersonHeroSection heroData={heroData} />
        <ContentSection className="mt-0 md:-mt-24 lg:-mt-48 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="lg:col-span-1">
              <PersonSidebar sidebarData={sidebarData} />
            </div>
            <div className="lg:col-span-3">
              <PersonContentSections contentData={contentData} />
            </div>
          </div>
        </ContentSection>
      </>
    );
  } catch (error) {
    console.error("Error loading person details:", error);
    notFound();
  }
}
