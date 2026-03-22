import ProducersPageSkeleton from "@/components/loading/ProducersPageSkeleton";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function Loading() {
  const viewPref = await getViewPreferenceCookie("producer-display");
  return <ProducersPageSkeleton viewPref={viewPref ?? "list"} />;
}
