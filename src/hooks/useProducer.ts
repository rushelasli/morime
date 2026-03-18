import { producersClient, animeClient } from "@/lib/api/jikan";
import type { Producer as JikanProducer, Pagination } from "@rushelasli/jikants";
import { retryWithBackoff } from "@/lib/api/retry";
import type { ProducerResponse, SearchResponse, AnimeResponse } from "@/types/api";

export async function getProducers(
  page: number = 1,
  options: {
    q?: string;
    order_by?: string;
    sort?: string;
    letter?: string;
    limit?: number;
  } = {}
): Promise<ProducerResponse> {
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
      () => producersClient.getProducersSearch(params),
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
    console.error('Error fetching producers after retries:', error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProducerById(id: number) {
  try {
    if (!id) {
      throw new Error("Producer ID is required");
    }

    const response = await retryWithBackoff(
      () => producersClient.getProducerFullById(id),
      { maxRetries: 2, delayMs: 500 }
    );

    if (response.data) {
      const producer = response.data;
      return {
        mal_id: producer.mal_id,
        name: producer.titles?.[0]?.title || "Unknown Producer",
        type: "anime",
        url: producer.url || `https://myanimelist.net/anime/producer/${id}`,
        titles: producer.titles || [{ type: "Default", title: "Unknown Producer" }],
        imageUrl: producer.images?.jpg?.image_url || producer.images?.webp?.image_url || null,
        favorites: producer.favorites || 0,
        count: producer.count || 0,
        established: producer.established,
        about: producer.about,
      };
    }

    throw new Error("Producer not found");
  } catch (error: unknown) {
    console.error(`Error fetching producer details for ID ${id}:`, error);

    try {
      const basicResponse = await retryWithBackoff(
        () => producersClient.getProducerById(id),
        { maxRetries: 2, delayMs: 500 }
      );

      if (basicResponse.data) {
        const producer = basicResponse.data;
        return {
          mal_id: producer.mal_id,
          name: producer.titles?.[0]?.title || "Unknown Producer",
          type: "anime",
          url: producer.url || `https://myanimelist.net/anime/producer/${id}`,
          titles: producer.titles || [{ type: "Default", title: "Unknown Producer" }],
          imageUrl: producer.images?.jpg?.image_url || producer.images?.webp?.image_url || null,
          favorites: producer.favorites || 0,
          count: producer.count || 0,
          established: producer.established || null,
          about: null,
        };
      }
    } catch (fallbackError) {
      console.error("Basic producer fetch also failed:", fallbackError);
    }

    try {
      const animeResponse = await retryWithBackoff(
        () => animeClient.searchAnime({
          producers: id.toString(),
          limit: 1,
        }),
        { maxRetries: 2, delayMs: 500 }
      );

      if (animeResponse.data && animeResponse.data.length > 0) {
        const producer = animeResponse.data[0].producers?.find(p => p.mal_id === id);

        if (producer) {
          return {
            mal_id: producer.mal_id,
            name: producer.name,
            type: "anime",
            url: producer.url,
            titles: [{ type: "Default", title: producer.name }],
            imageUrl: null,
            favorites: 0,
            count: 0,
            established: null,
            about: null,
          };
        }
      }
    } catch (lastResortError) {
      console.error("Last resort fallback also failed:", lastResortError);
    }

    throw error;
  }
}

export async function searchProducers(
  query: string,
  page: number = 1,
  options: {
    limit?: number;
    order_by?: string;
    sort?: string;
  } = {}
): Promise<SearchResponse<JikanProducer>> {
  if (!query?.trim()) {
    return { data: [], total: 0, hasNextPage: false, currentPage: page };
  }

  try {
    const response = await retryWithBackoff(
      async () => await getProducers(page, {
      q: query.trim(),
      limit: options.limit || 24,
      order_by: options.order_by,
      sort: options.sort,
      }),
      { maxRetries: 2, delayMs: 500 }
    );
    const data = response;

    return {
      data: data.data || [],
      total: data.totalItems || 0,
      hasNextPage: (data.pagination as any)?.has_next_page || false,
      currentPage: page,
    };
  } catch (error: unknown) {
    console.error("Error searching producers:", error);
    return {
      data: [],
      total: 0,
      hasNextPage: false,
      currentPage: page,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getProducerAnime(
  producerId: number,
  page: number = 1,
  limit: number = 24,
  sfw: boolean = true
): Promise<AnimeResponse> {
  try {
    const response = await retryWithBackoff(
      () => animeClient.searchAnime({
        producers: producerId.toString(),
        page,
        limit,
        order_by: 'favorites',
        sort: 'desc',
        sfw,
      }),
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
    console.error(`Error fetching anime for producer ${producerId} after retries:`, error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
