import { peopleClient } from "@/lib/api/jikan";
import type { Person as JikanPerson, Pagination } from "@rushelasli/jikants";
import { retryWithBackoff } from "@/lib/api/retry";
import type { ModelResponse, SearchResponse } from "@/types/api";
import type { PersonFull, Person, PersonAnimeStaff, PersonVoiceRole } from "@/types/people";

export async function getPeople(
  page: number = 1,
  options: {
    q?: string;
    order_by?: string;
    sort?: string;
    letter?: string;
    limit?: number;
  } = {}
): Promise<ModelResponse<Person>> {
  try {
    const params: Record<string, string | number | undefined> = {
      page,
      limit: options.limit || 24,
      order_by: options.order_by || "favorites",
      sort: options.sort || "desc",
    };

    if (options.q) params.q = options.q;
    if (options.letter) params.letter = options.letter;

    const response = await retryWithBackoff(
      () => peopleClient.getPeopleSearch(params),
      { maxRetries: 2, delayMs: 500 }
    );
    const pagination = "pagination" in response ? (response.pagination as Pagination | undefined) : undefined;

    return {
      data: response.data || [],
      totalPages: pagination?.last_visible_page ?? 1,
      currentPage: page,
      totalItems: pagination?.items?.total ?? 0,
      pagination: pagination,
    };
  } catch (error: unknown) {
    console.error('Error fetching people after retries:', error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPersonById(id: number) {
  try {
    if (!id) {
      throw new Error("Person ID is required");
    }

    const response = await retryWithBackoff(
      () => peopleClient.getPersonFullById(id),
      { maxRetries: 2, delayMs: 500 }
    );

    if (response.data) {
      const person = response.data as PersonFull;
      return {
        mal_id: person.mal_id,
        name: person.name,
        url: person.url,
        website_url: person.website_url,
        given_name: person.given_name,
        family_name: person.family_name,
        alternate_names: person.alternate_names || [],
        birthday: person.birthday,
        imageUrl: person.images?.jpg?.image_url || null,
        favorites: person.favorites || 0,
        about: person.about,
        anime: person.anime || [],
        manga: person.manga || [],
        voices: person.voices || [],
      };
    }

    throw new Error("Person not found");
  } catch (error: unknown) {
    console.error(`Error fetching person details for ID ${id}:`, error);

    try {
      const basicResponse = await retryWithBackoff(
        () => peopleClient.getPersonById(id),
        { maxRetries: 2, delayMs: 500 }
      );

      if (basicResponse.data) {
        const person = basicResponse.data as Person;
        return {
          mal_id: person.mal_id,
          name: person.name,
          url: person.url,
          website_url: person.website_url,
          given_name: person.given_name,
          family_name: person.family_name,
          alternate_names: person.alternate_names || [],
          birthday: person.birthday,
          imageUrl: person.images?.jpg?.image_url || null,
          favorites: person.favorites || 0,
          about: person.about,
          anime: [],
          manga: [],
          voices: [],
        };
      }
    } catch (fallbackError) {
      console.error("Basic person fetch also failed:", fallbackError);
    }

    throw error;
  }
}

export async function searchPeople(
  query: string,
  page: number = 1,
  options: {
    limit?: number;
    order_by?: string;
    sort?: string;
  } = {}
): Promise<SearchResponse<Person>> {
  if (!query?.trim()) {
    return { data: [], total: 0, hasNextPage: false, currentPage: page };
  }

  try {
    const response = await retryWithBackoff(
      async () => await getPeople(page, {
        q: query.trim(),
        limit: options.limit || 24,
        order_by: options.order_by,
        sort: options.sort,
      }),
      { maxRetries: 2, delayMs: 500 }
    );

    return {
      data: response.data || [],
      total: response.totalItems || 0,
      hasNextPage: (response.pagination as any)?.has_next_page || false,
      currentPage: page,
    };
  } catch (error: unknown) {
    console.error("Error searching people:", error);
    return {
      data: [],
      total: 0,
      hasNextPage: false,
      currentPage: page,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPersonAnime(
  personId: number,
  page: number = 1,
  limit: number = 24
): Promise<ModelResponse<PersonAnimeStaff>> {
  try {
    const response = await retryWithBackoff(
      () => peopleClient.getPersonAnime(personId),
      { maxRetries: 2, delayMs: 500 }
    );

    const animeList = response.data || [];
    const totalPages = Math.ceil(animeList.length / limit) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = animeList.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalPages: totalPages,
      currentPage: page,
      totalItems: animeList.length,
    };
  } catch (error: unknown) {
    console.error(`Error fetching anime for person ${personId} after retries:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPersonManga(
  personId: number,
  page: number = 1,
  limit: number = 24
): Promise<ModelResponse<any>> {
  try {
    const response = await retryWithBackoff(
      () => peopleClient.getPersonManga(personId),
      { maxRetries: 2, delayMs: 500 }
    );

    const mangaList = response.data || [];
    const totalPages = Math.ceil(mangaList.length / limit) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mangaList.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalPages: totalPages,
      currentPage: page,
      totalItems: mangaList.length,
    };
  } catch (error: unknown) {
    console.error(`Error fetching manga for person ${personId} after retries:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPersonVoiceRoles(
  personId: number,
  page: number = 1,
  limit: number = 24
): Promise<ModelResponse<PersonVoiceRole>> {
  try {
    const response = await retryWithBackoff(
      () => peopleClient.getPersonVoices(personId),
      { maxRetries: 2, delayMs: 500 }
    );

    const voiceRoles = response.data || [];
    const totalPages = Math.ceil(voiceRoles.length / limit) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = voiceRoles.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalPages: totalPages,
      currentPage: page,
      totalItems: voiceRoles.length,
    };
  } catch (error: unknown) {
    console.error(`Error fetching voice roles for person ${personId} after retries:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
