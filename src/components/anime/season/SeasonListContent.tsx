import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { SeasonList } from "@/components/anime/season/SeasonList";
import { seasonsClient } from "@/lib/api/jikan";

interface SeasonListItem {
  year: number;
  seasons: string[];
}

export default async function SeasonListContent() {
  let seasons: SeasonListItem[] = [];

  try {
    const response = await seasonsClient.getSeasonsList();

    if (response.data) {
      seasons = response.data.map((item: SeasonListItem) => ({
        year: item.year,
        seasons: item.seasons,
      }));
    }
  } catch (error) {
    console.error("Error fetching seasons list:", error);
  }

  return (
    <PageContainer as="section">
      <PageHeader
        title="Anime Seasons Archive"
        description="Browse anime by season and year - Explore past, present, and upcoming seasons"
      />

      {seasons.length > 0 ? (
        <SeasonList listData={seasons} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Seasons Available</h2>
          <p className="text-muted-foreground">Unable to load season data. Please try again later.</p>
        </div>
      )}
    </PageContainer>
  );
}
