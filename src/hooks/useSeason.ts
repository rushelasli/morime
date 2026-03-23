import { seasonsClient } from "@/lib/api/jikan";
import type { Pagination } from "@rushelasli/jikants";
import { retryWithBackoff } from "@/lib/api/retry";
import type { SeasonResponse } from "@/types/api";

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
      response = await retryWithBackoff(() => seasonsClient.getSeasonNow(params), { maxRetries: 2, delayMs: 500 });
    } else if (options.type === "seasons/upcoming") {
      response = await retryWithBackoff(() => seasonsClient.getSeasonUpcoming(params), { maxRetries: 2, delayMs: 500 });
    } else if (options.type?.startsWith("seasons/")) {
      const parts = options.type.split("/");
      if (parts.length === 3) {
        const year = parseInt(parts[1]);
        const season = parts[2] as "winter" | "spring" | "summer" | "fall";
        response = await retryWithBackoff(() => seasonsClient.getSeason(year, season, params), {
          maxRetries: 2,
          delayMs: 500,
        });
      } else {
        response = await retryWithBackoff(() => seasonsClient.getSeasonNow(params), { maxRetries: 2, delayMs: 500 });
      }
    } else {
      response = await retryWithBackoff(() => seasonsClient.getSeasonNow(params), { maxRetries: 2, delayMs: 500 });
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
    console.error("Error fetching season data after retries:", error);
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
    const response = await retryWithBackoff(() => seasonsClient.getSeasonsList(), { maxRetries: 2, delayMs: 500 });
    return response.data || [];
  } catch (error: unknown) {
    console.error("Error fetching season list after retries:", error);
    return [];
  }
}
