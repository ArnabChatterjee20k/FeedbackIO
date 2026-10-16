import useSWR from "swr";
import type {
  AnalyticsBreakdown,
  AnalyticsMetric,
  AnalyticsOverview,
} from "@/lib/analytics/types";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed with ${res.status}`);
  return res.json();
}

const options = { revalidateOnFocus: false, dedupingInterval: 60000, keepPreviousData: true };

export function useOverview(spaceId: string, start: string, end: string) {
  const params = new URLSearchParams({ spaceId, start, end });
  return useSWR<AnalyticsOverview>(`/api/analytics/overview?${params}`, fetcher, options);
}

export function useBreakdown(
  spaceId: string,
  metric: AnalyticsMetric,
  start: string,
  end: string
) {
  const params = new URLSearchParams({ spaceId, metric, start, end });
  return useSWR<AnalyticsBreakdown>(`/api/analytics/breakdown?${params}`, fetcher, options);
}
