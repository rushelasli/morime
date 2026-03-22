import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PeoplePageSkeleton } from "@/components/loading/PeoplePageSkeleton";
import type { ProducerPageProps } from "@/types/pages";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

const CharacterPageContent = dynamic(() => import("@/components/character/CharacterPageContent"));

export const metadata: Metadata = {
  title: "Characters",
  description: "Browse and search anime and manga characters",
};

export default async function CharacterPage(props: ProducerPageProps) {
  const viewPref = await getViewPreferenceCookie("character-display");

  return (
    <Suspense fallback={<PeoplePageSkeleton showSearch={true} viewPref={viewPref ?? "list"} />}>
      <CharacterPageContent {...props} />
    </Suspense>
  );
}
