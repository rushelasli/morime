import type { ProducerPageProps } from "@/types/pages";
import { searchCharacters, getCharacters } from "@/hooks/useCharacter";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/forms/SearchInput";
import { CharacterGrid } from "@/components/character/CharacterGrid";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function CharacterPageContent({ searchParams }: ProducerPageProps) {
  const viewPref = await getViewPreferenceCookie("character-display");
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page) || 1;
  const searchQuery = resolvedSearchParams?.q || "";
  const orderBy = resolvedSearchParams?.order_by || "favorites";
  const sort = resolvedSearchParams?.sort || "desc";
  const letter = resolvedSearchParams?.letter as string | undefined;

  let charactersData;

  if (searchQuery) {
    charactersData = await searchCharacters(searchQuery, currentPage, {
      limit: 24,
      order_by: orderBy,
      sort,
    });
  } else {
    charactersData = await getCharacters(currentPage, {
      limit: 24,
      order_by: orderBy,
      sort,
      letter,
    });
  }

  return (
    <PageContainer as="section">
      <PageHeader
        title={searchQuery ? `Search: ${searchQuery}` : "Characters"}
        description={searchQuery ? `Search results for "${searchQuery}"` : "Discover anime and manga characters"}
      />

      <SearchInput
        defaultValue={searchQuery}
        basePath="/character"
        placeholder="Search characters..."
        autoFocus={true}
      />

      <CharacterGrid initialView={viewPref ?? "list"}
        charactersData={charactersData}
        currentPage={currentPage}
        basePath="/character"
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