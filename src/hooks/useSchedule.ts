import { schedulesClient } from "@/lib/api/jikan";
import type { Pagination } from "@rushelasli/jikants";
import { retryWithBackoff } from "@/lib/api/retry";
import type { ScheduleResponse } from "@/types/api";

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

    if (options.kids !== undefined) {
      params.kids = options.kids;
    }

    if (options.unapproved !== undefined) {
      params.unapproved = options.unapproved;
    }

    const response = await retryWithBackoff(() => schedulesClient.getSchedules(params));

    const pagination = "pagination" in response ? (response.pagination as Pagination | undefined) : undefined;

    return {
      data: response.data || [],
      totalPages: pagination?.last_visible_page ?? 1,
      currentPage: page,
      totalItems: pagination?.items?.total ?? 0,
      error: undefined,
    };
  } catch (error: unknown) {
    console.error("Error fetching schedules after retries:", error);
    return {
      data: [],
      totalPages: 0,
      currentPage: page,
      totalItems: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
