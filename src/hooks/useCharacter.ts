import { charactersClient } from "@/lib/api/jikan";
import type { Pagination } from "@rushelasli/jikants";
import { retryWithBackoff } from "@/lib/api/retry";
import type { ModelResponse, SearchResponse } from "@/types/api";
import type { CharacterData, CharacterFull } from "@/types/character";

export async function getCharacters(
  page: number = 1,
  options: {
    q?: string;
    order_by?: string;
    sort?: string;
    letter?: string;
    limit?: number;
  } = {}
): Promise<ModelResponse<CharacterData>> {
  try {
    const params: Record<string, string | number | undefined> = {
      page,
      limit: options.limit || 24,
      order_by: options.order_by || "favorites",
      sort: options.sort || "desc",
    };

    if (options.q) params.q = options.q;
    if (options.letter) params.letter = options.letter;

    const response = await retryWithBackoff(() => charactersClient.getCharacterSearch(params));
    const pagination = "pagination" in response ? (response.pagination as Pagination | undefined) : undefined;

    return {
      data: response.data || [],
      totalPages: pagination?.last_visible_page ?? 1,
      currentPage: page,
      totalItems: pagination?.items?.total ?? 0,
      pagination: pagination,
    };
  } catch (error: unknown) {
    console.error("Error fetching characters after retries:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getCharacterById(id: number) {
  try {
    if (!id) {
      throw new Error("Character ID is required");
    }

    const response = await retryWithBackoff(() => charactersClient.getCharacterFullById(id));

    if (response.data) {
      const character = response.data as CharacterFull;
      return {
        mal_id: character.mal_id,
        name: character.name,
        name_kanji: character.name_kanji,
        nicknames: character.nicknames || [],
        url: character.url,
        imageUrl: character.images?.webp?.image_url || character.images?.jpg?.image_url || null,
        favorites: character.favorites || 0,
        about: character.about,
        anime: character.anime || [],
        manga: character.manga || [],
        voices: character.voices || [],
      };
    }

    throw new Error("Character not found");
  } catch (error: unknown) {
    console.error(`Error fetching character details for ID ${id}:`, error);

    try {
      const basicResponse = await retryWithBackoff(() => charactersClient.getCharacterById(id));

      if (basicResponse.data) {
        const character = basicResponse.data as CharacterData;
        return {
          mal_id: character.mal_id,
          name: character.name,
          name_kanji: character.name_kanji,
          nicknames: character.nicknames || [],
          url: character.url,
          imageUrl: character.images?.webp?.image_url || character.images?.jpg?.image_url || null,
          favorites: character.favorites || 0,
          about: character.about,
          anime: [],
          manga: [],
          voices: [],
        };
      }
    } catch (fallbackError) {
      console.error("Basic character fetch also failed:", fallbackError);
    }

    throw error;
  }
}

export async function searchCharacters(
  query: string,
  page: number = 1,
  options: {
    limit?: number;
    order_by?: string;
    sort?: string;
  } = {}
): Promise<SearchResponse<CharacterData>> {
  if (!query?.trim()) {
    return { data: [], total: 0, hasNextPage: false, currentPage: page };
  }

  try {
    const response = await retryWithBackoff(
      async () =>
        await getCharacters(page, {
          q: query.trim(),
          limit: options.limit || 24,
          order_by: options.order_by,
          sort: options.sort,
        })
    );

    return {
      data: response.data || [],
      total: response.totalItems || 0,
      hasNextPage: (response.pagination as any)?.has_next_page || false,
      currentPage: page,
    };
  } catch (error: unknown) {
    console.error("Error searching characters:", error);
    return {
      data: [],
      total: 0,
      hasNextPage: false,
      currentPage: page,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
