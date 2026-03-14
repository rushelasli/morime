import { schedulesClient } from "@/lib/api/jikan";
import type { Anime as JikanAnime, Pagination } from "@rushelasli/jikants";

interface ScheduleResponse {
  data: JikanAnime[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  error?: string;
}

export async function getSchedules(
  page: number = 1,
  options: {
    filter?: string;
    kids?: string;
    sfw?: boolean;
    unapproved?: boolean;
    limit?: number;
  } = {}
): Promise<ScheduleResponse> {
  try {
    const params: Record<string, string | number | boolean | undefined> = {
      page,
      limit: options.limit || 24,
      sfw: options.sfw ?? true,
    };

    if (options.filter) {
      params.filter = options.filter;
    }

    if (options.kids !== "false") {
      params.kids = "false";
    }

    if (options.unapproved !== undefined) {
      params.unapproved = options.unapproved;
    }

    const response = await schedulesClient.getSchedules(params);
    const pagination = "pagination" in response ? (response.pagination as Pagination | undefined) : undefined;

    return {
      data: response.data || [],
      totalPages: pagination?.last_visible_page ?? 1,
      currentPage: page,
      totalItems: pagination?.items?.total ?? 0,
    };
  } catch (error: unknown) {
    console.error("Error fetching schedule data:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
