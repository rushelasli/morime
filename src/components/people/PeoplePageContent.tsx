import type { PageContentProps } from "@/types/pages";
import { searchPeople, getPeople } from "@/hooks/usePeople";
import type { Person } from "@/types/people";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/forms/SearchInput";
import { PeopleGrid } from "@/components/people/PeopleGrid";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function PeoplePageContent({ searchParams }: PageContentProps) {
  const viewPref = await getViewPreferenceCookie("people-display");
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt((resolvedSearchParams?.page as string) || "1");
  const searchQuery = (resolvedSearchParams?.q as string) || "";

  let peopleData: {
    data: Person[];
    totalPages?: number;
    total?: number;
  } | null = null;

  if (searchQuery) {
    const result = await searchPeople(searchQuery, currentPage, {
      limit: 24,
    });
    peopleData = {
      data: result.data || [],
      totalPages: Math.ceil((result.total || 0) / 24),
      total: result.total,
    };
  } else {
    const result = await getPeople(currentPage, {
      limit: 24,
    });
    peopleData = {
      data: result.data || [],
      totalPages: result.totalPages || 1,
      total: result.totalItems,
    };
  }

  const peopleListData = peopleData
    ? {
        data: peopleData.data || [],
        totalPages: peopleData.totalPages || 1,
      }
    : null;

  return (
    <PageContainer as="section">
      <PageHeader
        title={searchQuery ? `Search: ${searchQuery}` : "People & Voice Actors"}
        description={searchQuery ? `Search results for "${searchQuery}"` : "Discover voice actors, directors, and other anime industry professionals"}
      />

      <SearchInput
        defaultValue={searchQuery}
        basePath="/people"
        placeholder="Search voice actors, directors, writers..."
        autoFocus={true}
      />

      <PeopleGrid initialView={viewPref ?? "list"}
        peopleData={peopleListData}
        currentPage={currentPage}
        basePath="/people"
        queryParams={{
          ...(searchQuery && { q: searchQuery }),
        }}
      />
    </PageContainer>
  );
}
