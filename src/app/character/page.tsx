import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PeoplePageSkeleton } from "@/components/loading/PeoplePageSkeleton";
import type { ProducerPageProps } from "@/types/pages";

const CharacterPageContent = dynamic(() => import("@/components/character/CharacterPageContent"), {
  loading: () => <PeoplePageSkeleton showSearch={true} />,
});

export const metadata: Metadata = {
  title: "Characters",
  description: "Browse and search anime and manga characters",
};

export default async function CharacterPage(props: ProducerPageProps) {
  return (
    <Suspense fallback={<PeoplePageSkeleton showSearch={true} />}>
      <CharacterPageContent {...props} />
    </Suspense>
  );
}