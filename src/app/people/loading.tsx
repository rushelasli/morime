import { PeoplePageSkeleton } from "@/components/loading/PeoplePageSkeleton";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function Loading() {
  const viewPref = await getViewPreferenceCookie("people-display");
  return <PeoplePageSkeleton viewPref={viewPref ?? "list"} />;
}
