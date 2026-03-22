import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ProducersPageSkeleton from "@/components/loading/ProducersPageSkeleton";
import { SearchPageProps } from "@/types/pages";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

const ProducerPageContent = dynamic(() => import("@/components/producer/ProducerPageContent"));

export const metadata: Metadata = {
  title: "Producers & Studios",
  description: "Browse anime producers and studios. Search, filter and discover production companies.",
};

export default async function Page(props: SearchPageProps) {
  const viewPref = await getViewPreferenceCookie("producer-display");

  return (
    <Suspense fallback={<ProducersPageSkeleton showSearch={true} viewPref={viewPref ?? "list"} />}>
      <ProducerPageContent {...props} />
    </Suspense>
  );
}
