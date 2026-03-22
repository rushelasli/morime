import { PeoplePageSkeleton } from "@/components/loading/PeoplePageSkeleton";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function Loading() {
  const viewPref = await getViewPreferenceCookie("character-display");
  return <PeoplePageSkeleton showSearch={true} viewPref={viewPref ?? "list"} />;
}
