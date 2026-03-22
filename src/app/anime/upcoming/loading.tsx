import UpcomingSkeleton from "@/components/loading/UpcomingSkeleton";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function Loading() {
  const viewPref = await getViewPreferenceCookie("anime-display");
  return <UpcomingSkeleton viewPref={viewPref} />;
}
