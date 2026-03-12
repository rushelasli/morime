import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import MangaSearchSkeleton from "@/components/loading/MangaSearchSkeleton";
import MangaBrowseSkeleton from "@/components/loading/MangaBrowseSkeleton";
import type { SearchPageProps } from "@/types/pages";

const MangaPageContent = dynamic(
  () => import("@/components/manga/MangaPageContent"),
);

export const metadata: Metadata = {
  title: "Manga List",
  description:
    "Browse and discover manga. Search, filter by type and status, and explore thousands of manga titles.",
};

function MangaPageSkeleton({ searchParams }: { searchParams: { q?: string } }) {
  const hasSearchQuery = searchParams?.q && searchParams.q.trim() !== "";
  return hasSearchQuery ? <MangaSearchSkeleton /> : <MangaBrowseSkeleton />;
}

export default async function Page(props: SearchPageProps) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<MangaPageSkeleton searchParams={searchParams} />}>
      <MangaPageContent {...props} />
    </Suspense>
  );
}