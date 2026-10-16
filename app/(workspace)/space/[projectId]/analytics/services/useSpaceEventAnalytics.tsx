import useSWR from "swr";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSpaceEventAnalytics(spaceId: string) {
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const params = new URLSearchParams({ spaceId });
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  const { data, error, isLoading } = useSWR(
    `/api/analytics/feedback/metadata?${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return { data, error, isLoading };
}
