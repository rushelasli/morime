import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentSection } from "@/components/layout/PageContainer";
import { PersonHeroSection } from "@/components/people/detail/sections/HeroSection";
import { PersonSidebar } from "@/components/people/detail/sections/Sidebar";
import { PersonContentSections } from "@/components/people/detail/sections/ContentSections";
import { getPersonById } from "@/hooks/usePeople";
import { toSnakeCase } from "@/lib/utils/Formatter";
import type { PagePropsWithBoth, MalIdParams, BaseSearchParams } from "@/types/pages";

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
  searchParams,
}: PagePropsWithBoth<MalIdParams, BaseSearchParams>) {
  const { malId } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");

  if (isNaN(Number(malId))) {
    notFound();
  }

  try {
    const personData = await getPersonById(Number(malId));

    if (!personData) {
      notFound();
    }

    const calculateAge = (birthday: string | null) => {
      if (!birthday) return null;
      const today = new Date();
      const birthDate = new Date(birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 0 ? age : null;
    };

    const age = calculateAge(personData.birthday);

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
      age,
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
              <PersonContentSections
                contentData={contentData}
                personId={personData.mal_id}
                personName={personData.name}
                currentPage={currentPage}
              />
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