import useSWR from "swr";
import { eventType, visitType } from "../../types/analytics";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSpaceEventAnalytics(spaceId: string) {
  const { data, error, isLoading } = useSWR(
    `/api/analytics/feedback/metadata?spaceId=${spaceId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return { data, error, isLoading };
}