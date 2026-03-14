import { animeClient, topClient, genresClient } from "@/lib/api/jikan";
import type { JikanResponseWithPagination, AnimeSearchParams, Anime as JikanAnime, Pagination } from "@rushelasli/jikants";
import { adaptAnimeCharacters, adaptAnimeEpisodes } from "@/lib/api/adapters";

interface AnimeResponse {
  data: JikanAnime[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  error?: string;
}

interface SearchResponse {
  data: JikanAnime[];
  total: number;
  hasNextPage: boolean;
  currentPage: number;
  error?: string;
}

export async function getAnime(
  page: number = 1,
  options: {
    type?: string;
    status?: string;
    rating?: string;
    genres?: string;
    producers?: string;
    order_by?: string;
    sort?: string;
    limit?: number;
    sfw?: boolean;
  } = {}
): Promise<AnimeResponse> {
  try {
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      limit: options.limit || 24,
      sfw: options.sfw ?? true,
    };

    if (options.type) params.type = options.type;
    if (options.status) params.status = options.status;
    if (options.rating) params.rating = options.rating;
    if (options.genres) params.genres = options.genres;
    if (options.producers) params.producers = options.producers;
    if (options.order_by) params.order_by = options.order_by;
    if (options.sort) params.sort = options.sort;

    const response: JikanResponseWithPagination<JikanAnime[]> = await animeClient.searchAnime(
      params as Partial<AnimeSearchParams>
    );

    return {
      data: response.data || [],
      totalPages: response.pagination?.last_visible_page || 1,
      currentPage: page,
      totalItems: response.pagination?.items?.total || 0,
    };
  } catch (error: unknown) {
    console.error("Error fetching anime list:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getTopAnime(
  page: number = 1,
  options: {
    type?: string;
    filter?: string;
    rating?: string;
    limit?: number;
    sfw?: boolean;
  } = {}
): Promise<AnimeResponse> {
  try {
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      limit: options.limit || 24,
      sfw: options.sfw ?? true,
    };

    if (options.type) params.type = options.type;
    if (options.filter) params.filter = options.filter;
    if (options.rating) params.rating = options.rating;

    const response = await topClient.getTopAnime(params);
    const pagination = "pagination" in response ? (response.pagination as Pagination | undefined) : undefined;

    return {
      data: response.data || [],
      totalPages: pagination?.last_visible_page ?? 1,
      currentPage: page,
      totalItems: pagination?.items?.total ?? 0,
    };
  } catch (error: unknown) {
    console.error("Error fetching top anime:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getDetailAnime(malId: number) {
  try {
    const response = await animeClient.getAnimeFullById(malId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching anime details for ID ${malId}:`, error);
    throw error;
  }
}

export async function getAnimeCharacters(malId: number) {
  try {
    const response = await animeClient.getAnimeCharacters(malId);
    return adaptAnimeCharacters(response.data || []);
  } catch (error) {
    console.error(`Error fetching characters for anime ID ${malId}:`, error);
    return [];
  }
}

export async function getEpisodeAnime(malId: number) {
  try {
    const response = await animeClient.getAnimeEpisodes(malId, 1);
    return adaptAnimeEpisodes(response.data || []);
  } catch (error) {
    console.error(`Error fetching episodes for ID ${malId}:`, error);
    return [];
  }
}

export async function getAnimeGenresList() {
  try {
    const response = await genresClient.getAnimeGenres();
    return response.data || [];
  } catch (error) {
    console.error("Error fetching anime genres list:", error);
    return [];
  }
}

export async function searchAnime(
  query: string,
  page: number = 1,
  limit: number = 20,
  sfw?: boolean
): Promise<SearchResponse> {
  if (!query?.trim()) {
    return { data: [], total: 0, hasNextPage: false, currentPage: page };
  }

  try {
    const response: JikanResponseWithPagination<JikanAnime[]> = await animeClient.searchAnime({
      q: query.trim(),
      page,
      limit,
      sfw: sfw ?? true,
    });

    return {
      data: response.data || [],
      total: response.pagination?.items?.total || 0,
      hasNextPage: response.pagination?.has_next_page || false,
      currentPage: page,
    };
  } catch (error: unknown) {
    console.error("Error searching anime:", error);
    return {
      data: [],
      total: 0,
      hasNextPage: false,
      currentPage: page,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getRecentlyCompletedAnime(
  page: number = 1,
  options: { type?: string; limit?: number; sfw?: boolean } = {}
): Promise<AnimeResponse & { total: number; hasNextPage: boolean }> {
  try {
    const limit = options.limit || 24;
    const params: Record<string, string | number | boolean> = {
      page,
      limit,
      status: "complete",
      order_by: "end_date",
      sort: "desc",
      sfw: options.sfw ?? true,
    };

    if (options.type) {
      params.type = options.type;
    }

    const response: JikanResponseWithPagination<JikanAnime[]> = await animeClient.searchAnime(
      params as Partial<AnimeSearchParams>
    );

    return {
      data: response.data || [],
      totalPages: response.pagination?.last_visible_page || 1,
      currentPage: page,
      totalItems: response.pagination?.items?.total || 0,
      total: response.pagination?.items?.total || 0,
      hasNextPage: response.pagination?.has_next_page || false,
    };
  } catch (error: unknown) {
    console.error("Error fetching recently completed anime:", error);
    return {
      data: [],
      totalPages: 1,
      currentPage: page,
      totalItems: 0,
      total: 0,
      hasNextPage: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
