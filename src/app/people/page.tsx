import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PeoplePageSkeleton } from "@/components/loading/PeoplePageSkeleton";
import type { SearchPageProps } from "@/types/pages";

const PeoplePageContent = dynamic(() => import("@/components/people/PeoplePageContent"), {
  loading: () => <PeoplePageSkeleton showSearch={true} />,
});

export const metadata: Metadata = {
  title: "People & Voice Actors",
  description: "Browse anime voice actors, directors, composers and other industry professionals. Search and discover talented staff members.",
};

export default async function Page(props: SearchPageProps) {
  return (
    <Suspense fallback={<PeoplePageSkeleton showSearch={true} />}>
      <PeoplePageContent {...props} />
    </Suspense>
  );
}