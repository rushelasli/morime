export interface BaseSearchParams {
  page?: string;
  q?: string;
}

export interface FilterSearchParams extends BaseSearchParams {
  type?: string;
}

export interface FullSearchParams extends FilterSearchParams {
  status?: string;
  order_by?: string;
  sort?: string;
}

export interface ScheduleSearchParams extends BaseSearchParams {
  day?: string;
}

export interface ProducerSearchParams extends BaseSearchParams {
  order_by?: string;
  sort?: string;
  letter?: string;
}

export interface MalIdParams {
  malId: string;
  title: string;
}

export interface SeasonParams {
  year: string;
  season: string;
}

export interface TopAnimeParams {
  type?: string[];
}

export interface PagePropsWithSearch<T = BaseSearchParams> {
  searchParams: Promise<T>;
}

export interface PagePropsWithParams<P = MalIdParams> {
  params: Promise<P>;
}

export interface PagePropsWithBoth<P = MalIdParams, S = BaseSearchParams> {
  params: Promise<P>;
  searchParams: Promise<S>;
}

export type PageContentProps = PagePropsWithSearch;
export type ListPageProps = PagePropsWithSearch<FilterSearchParams>;
export type SearchPageProps = PagePropsWithSearch<FullSearchParams>;
export type DetailPageProps = PagePropsWithParams;
export type DetailWithPaginationProps = PagePropsWithBoth;
export type SeasonPageProps = PagePropsWithBoth<SeasonParams, FilterSearchParams>;
export type SchedulePageProps = PagePropsWithSearch<ScheduleSearchParams>;
export type ProducerPageProps = PagePropsWithSearch<ProducerSearchParams>;
export type TopAnimePageProps = PagePropsWithBoth<TopAnimeParams>;
