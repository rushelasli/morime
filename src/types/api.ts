/**
 * Reusable API response types for hooks
 * Consolidates response interfaces to avoid duplication across hooks
 */

import type { Pagination } from "@rushelasli/jikants";

/**
 * Generic model response for list/browse endpoints
 *
 * Why pagination is optional:
 * - Producer & Season endpoints return full Pagination object from API
 * - Anime & Manga endpoints don't include full pagination, only computed fields
 * Making it optional supports both patterns
 */
export interface ModelResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  pagination?: Pagination;
  error?: string;
}

/**
 * Generic search response for search endpoints
 * Used for search results with different pagination style
 */
export interface SearchResponse<T> {
  data: T[];
  total: number;
  hasNextPage: boolean;
  currentPage: number;
  error?: string;
}

/**
 * Type aliases for specific entity types
 */
export type AnimeResponse = ModelResponse<any>;
export type MangaResponse = ModelResponse<any>;
export type ProducerResponse = ModelResponse<any>;
export type SeasonResponse = ModelResponse<any>;
export type ScheduleResponse = ModelResponse<any>;

export type AnimeSearchResponse = SearchResponse<any>;
export type MangaSearchResponse = SearchResponse<any>;
export type ProducerSearchResponse = SearchResponse<any>;
