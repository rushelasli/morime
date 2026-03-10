import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import MangaListSkeleton from "@/components/loading/MangaListSkeleton";
import type { SearchPageProps } from "@/types/pages";

const MangaPageContent = dynamic(
  () => import("@/components/manga/MangaPageContent"),
);

export const metadata: Metadata = {
  title: "Manga List | Morime",
  description:
    "Browse and discover manga. Search, filter by type and status, and explore thousands of manga titles.",
};

function MangaPageSkeleton({ searchParams }: { searchParams: { q?: string } }) {
  const hasSearchQuery = searchParams?.q && searchParams.q.trim() !== "";
  return <MangaListSkeleton showSearch={true} isSearching={hasSearchQuery} />;
}

export default async function Page(props: SearchPageProps) {
  const searchParams = await props.searchParams;

  return (
    <Suspense fallback={<MangaPageSkeleton searchParams={searchParams} />}>
      <MangaPageContent {...props} />
    </Suspense>
  );
}