import { ProducerPageProps } from "@/types";
import type { Producer as JikanProducer } from "@rushelasli/jikants";
import { searchProducers } from "@/hooks/useProducer";
import { getProducers } from "@/hooks/useProducer";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/forms/SearchInput";
import { ProducersGrid } from "@/components/producer/ProducersGrid";

export default async function ProducerPageContent({ searchParams }: ProducerPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page) || 1;
  const searchQuery = resolvedSearchParams?.q || "";
  const orderBy = resolvedSearchParams?.order_by;
  const sort = resolvedSearchParams?.sort;
  const letter = resolvedSearchParams?.letter;

  let producersData: {
    data: JikanProducer[];
    totalPages?: number;
    total?: number;
  } | null = null;

  if (searchQuery) {
    producersData = await searchProducers(searchQuery, currentPage, {
      limit: 24,
      order_by: orderBy,
      sort,
    });
  } else {
    producersData = await getProducers(currentPage, {
      limit: 24,
      order_by: orderBy,
      sort,
      letter,
    });
  }

  const producerListData = producersData
    ? {
        data:
          producersData.data?.map((producer: JikanProducer) => ({
            mal_id: producer.mal_id,
            type: "anime",
            name: producer.titles?.[0]?.title || "Unknown",
            url: producer.url || "",
            titles: producer.titles || [],
            images: producer.images || { jpg: { image_url: null } },
            favorites: producer.favorites || 0,
            established: producer.established || null,
            about: producer.about || null,
            count: producer.count || 0,
          })) || [],
        totalPages: producersData.totalPages || 1,
      }
    : null;

  return (
    <PageContainer as="section">
      <PageHeader
        title={searchQuery ? `Search: ${searchQuery}` : "Producers & Studios"}
        description={searchQuery ? `Search results for "${searchQuery}"` : "Discover anime production companies and studios"}
      />

      <SearchInput
        defaultValue={searchQuery}
        basePath="/producer"
        placeholder="Search producers and studios..."
        autoFocus={true}
      />

      <ProducersGrid
        producersData={producerListData}
        currentPage={currentPage}
        basePath="/producer"
        queryParams={{
          ...(searchQuery && { q: searchQuery }),
          ...(orderBy && !searchQuery && { order_by: orderBy }),
          ...(sort && !searchQuery && { sort }),
          ...(letter && !searchQuery && { letter }),
        }}
      />
    </PageContainer>
  );
}
