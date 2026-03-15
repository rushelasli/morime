import { mangaClient, topClient, genresClient } from "@/lib/api/jikan";
import type {
  JikanResponseWithPagination,
  MangaSearchParams,
  Manga as JikanManga,
  Pagination,
} from "@rushelasli/jikants";
import { adaptAnimeCharacters } from "@/lib/api/adapters";
import { retryWithBackoff } from "@/lib/api/retry";

interface MangaResponse {
  data: JikanManga[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  error?: string;
}

interface SearchResponse {
  data: JikanManga[];
  total: number;
  hasNextPage: boolean;
  currentPage: number;
  error?: string;
}

export async function getManga(
  page: number = 1,
  options: {
    type?: string;
    status?: string;
    genres?: string;
    magazines?: string;
    order_by?: string;
    sort?: string;
    limit?: number;
    sfw?: boolean;
  } = {}
): Promise<MangaResponse> {
  try {
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      limit: options.limit || 24,
      sfw: options.sfw ?? true,
    };

    if (options.type) params.type = options.type;
    if (options.status) params.status = options.status;
    if (options.genres) params.genres = options.genres;
    if (options.magazines) params.magazines = options.magazines;
    if (options.order_by) params.order_by = options.order_by;
    if (options.sort) params.sort = options.sort;

    const response: JikanResponseWithPagination<JikanManga[]> =
      await retryWithBackoff(
        () => mangaClient.searchManga(params as Partial<MangaSearchParams>),
        { maxRetries: 2, delayMs: 500 }
      );

    return {
      data: response.data || [],
      totalPages: response.pagination?.last_visible_page || 1,
      currentPage: page,
      totalItems: response.pagination?.items?.total || 0,
    };
  } catch (error: unknown) {
    console.error("Error fetching manga list after retries:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getTopManga(
  page: number = 1,
  options: {
    type?: string;
    filter?: string;
    limit?: number;
    sfw?: boolean;
  } = {}
): Promise<MangaResponse> {
  try {
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      limit: options.limit || 24,
      sfw: options.sfw ?? true,
    };

    if (options.type) params.type = options.type;
    if (options.filter) params.filter = options.filter;

    const response = await retryWithBackoff(
      () => topClient.getTopManga(params),
      { maxRetries: 2, delayMs: 500 }
    );
    const pagination = "pagination" in response ? (response.pagination as Pagination | undefined) : undefined;

    return {
      data: response.data || [],
      totalPages: pagination?.last_visible_page ?? 1,
      currentPage: page,
      totalItems: pagination?.items?.total ?? 0,
    };
  } catch (error: unknown) {
    console.error("Error fetching top manga after retries:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getDetailManga(malId: number) {
  try {
    const response = await retryWithBackoff(
      () => mangaClient.getMangaFullById(malId),
      { maxRetries: 2, delayMs: 500 }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching manga details for ID ${malId} after retries:`, error);
    throw error;
  }
}

export async function getMangaCharacters(malId: number) {
  try {
    const response = await retryWithBackoff(
      () => mangaClient.getMangaCharacters(malId),
      { maxRetries: 2, delayMs: 500 }
    );
    return adaptAnimeCharacters(response.data || []);
  } catch (error) {
    console.error(`Error fetching characters for manga ID ${malId} after retries:`, error);
    return [];
  }
}

export async function getMangaGenresList() {
  try {
    const response = await retryWithBackoff(
      () => genresClient.getMangaGenres(),
      { maxRetries: 3, delayMs: 500 }
    );
    const data = response.data || [];
    if (data.length === 0) {
      console.warn("[getMangaGenresList] Received empty genres list from API");
    }
    return data;
  } catch (error) {
    console.error("Error fetching manga genres list after retries:", error);
    return [];
  }
}

export async function searchManga(
  query: string,
  page: number = 1,
  limit: number = 20,
  sfw?: boolean
): Promise<SearchResponse> {
  if (!query?.trim()) {
    return { data: [], total: 0, hasNextPage: false, currentPage: page };
  }

  try {
    const response: JikanResponseWithPagination<JikanManga[]> =
      await retryWithBackoff(
        () =>
          mangaClient.searchManga({
            q: query.trim(),
            page,
            limit,
            sfw: sfw ?? true,
          }),
        { maxRetries: 2, delayMs: 500 }
      );

    return {
      data: response.data || [],
      total: response.pagination?.items?.total || 0,
      hasNextPage: response.pagination?.has_next_page || false,
      currentPage: page,
    };
  } catch (error: unknown) {
    console.error("Error searching manga after retries:", error);
    return {
      data: [],
      total: 0,
      hasNextPage: false,
      currentPage: page,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}