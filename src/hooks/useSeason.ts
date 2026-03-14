import { seasonsClient } from "@/lib/api/jikan";
import type { Anime as JikanAnime, Pagination } from "@rushelasli/jikants";

interface SeasonResponse {
  data: JikanAnime[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  pagination?: Pagination;
  error?: string;
}

interface SeasonListItem {
  year: number;
  seasons: string[];
}

export async function getSeason(
  page: number = 1,
  options: {
    type?: string;
    filter?: string;
    limit?: number;
    unapproved?: boolean;
    continuing?: boolean;
    sfw?: boolean;
  } = {}
): Promise<SeasonResponse> {
  try {
    const limit = options.limit || 24;
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      limit,
      sfw: options.sfw ?? true,
    };

    // Add filter parameter if provided (for type filtering like TV, Movie, etc.)
    if (options.filter) {
      params.filter = options.filter.toLowerCase();
    }

    if (options.unapproved !== undefined) {
      params.unapproved = options.unapproved;
    }

    if (options.continuing !== undefined) {
      params.continuing = options.continuing;
    }

    let response;

    if (options.type === "seasons/now") {
      response = await seasonsClient.getSeasonNow(params);
    } else if (options.type === "seasons/upcoming") {
      response = await seasonsClient.getSeasonUpcoming(params);
    } else if (options.type?.startsWith("seasons/")) {
      // Handle specific year/season like "seasons/2024/winter"
      const parts = options.type.split("/");
      if (parts.length === 3) {
        const year = parseInt(parts[1]);
        const season = parts[2] as "winter" | "spring" | "summer" | "fall";
        response = await seasonsClient.getSeason(year, season, params);
      } else {
        response = await seasonsClient.getSeasonNow(params);
      }
    } else {
      response = await seasonsClient.getSeasonNow(params);
    }

    const pagination = "pagination" in response ? (response.pagination as Pagination | undefined) : undefined;

    return {
      data: response.data || [],
      totalPages: pagination?.last_visible_page ?? 1,
      currentPage: page,
      totalItems: pagination?.items?.total ?? 0,
      pagination: pagination,
    };
  } catch (error: unknown) {
    console.error("Error fetching season data:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getSeasonList(): Promise<SeasonListItem[]> {
  try {
    const response = await seasonsClient.getSeasonsList();
    return response.data || [];
  } catch (error: unknown) {
    console.error("Error fetching season list:", error);
    return [];
  }
}
