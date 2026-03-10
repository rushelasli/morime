import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ProducersPageSkeleton from "@/components/loading/ProducersPageSkeleton";
import { SearchPageProps } from "@/types/pages";

const ProducerPageContent = dynamic(
  () => import("@/components/producer/ProducerPageContent"),
);

export const metadata: Metadata = {
  title: "Producers & Studios | Morime",
  description:
    "Browse anime producers and studios. Search, filter and discover production companies.",
};

export default async function Page(props: SearchPageProps) {
  return (
    <Suspense fallback={<ProducersPageSkeleton showSearch={true} />}>
      <ProducerPageContent {...props} />
    </Suspense>
  );
}