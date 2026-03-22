import ProducerDetailsSkeleton from "@/components/loading/ProducerDetailsSkeleton";
import { getViewPreferenceCookie } from "@/actions/CookieActions";

export default async function Loading() {
  const viewPref = await getViewPreferenceCookie("anime-display");
  return <ProducerDetailsSkeleton viewPref={viewPref} />;
}
