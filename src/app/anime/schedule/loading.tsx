import { ScheduleSkeleton } from "@/components/loading/ScheduleSkeleton";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function loading() {
  const viewPref = await getViewPreferenceCookie("anime-display");
  return <ScheduleSkeleton viewPref={viewPref} />;
}
