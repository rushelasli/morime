import GenrePageSkeleton from "@/components/loading/GenrePageSkeleton";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function loading() {
  const viewPref = await getViewPreferenceCookie("anime-display");
  return <GenrePageSkeleton viewPref={viewPref} />;
}
