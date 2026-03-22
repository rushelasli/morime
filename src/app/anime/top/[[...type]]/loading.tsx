import { AnimeGridSkeleton } from "@/components/loading/AnimeGridSkeleton";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function Loading() {
  const viewPref = await getViewPreferenceCookie("anime-display");
  return <AnimeGridSkeleton viewPref={viewPref} />;
}
