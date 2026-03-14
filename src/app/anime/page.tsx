import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimeSearchSkeleton from "@/components/loading/AnimeSearchSkeleton";
import AnimeBrowseSkeleton from "@/components/loading/AnimeBrowseSkeleton";
import type { SearchPageProps } from "@/types/pages";

const AnimePageContent = dynamic(() => import("@/components/anime/AnimePageContent"));

export const metadata: Metadata = {
  title: "Anime List",
  description: "Browse and discover anime. Search, filter by type and status, and explore thousands of anime titles.",
};

function AnimePageSkeleton({ searchParams }: { searchParams: { q?: string } }) {
  const hasSearchQuery = searchParams?.q && searchParams.q.trim() !== "";
  return hasSearchQuery ? <AnimeSearchSkeleton /> : <AnimeBrowseSkeleton />;
}

export default async function Page(props: SearchPageProps) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<AnimePageSkeleton searchParams={searchParams} />}>
      <AnimePageContent {...props} />
    </Suspense>
  );
}
