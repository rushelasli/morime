import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PeoplePageSkeleton } from "@/components/loading/PeoplePageSkeleton";
import type { SearchPageProps } from "@/types/pages";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

const PeoplePageContent = dynamic(() => import("@/components/people/PeoplePageContent"));

export const metadata: Metadata = {
  title: "People & Voice Actors",
  description: "Browse anime voice actors, directors, composers and other industry professionals. Search and discover talented staff members.",
};

export default async function Page(props: SearchPageProps) {
  const viewPref = await getViewPreferenceCookie("people-display");

  return (
    <Suspense fallback={<PeoplePageSkeleton showSearch={true} viewPref={viewPref ?? "list"} />}>
      <PeoplePageContent {...props} />
    </Suspense>
  );
}
