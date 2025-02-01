// hooks/useAnalytics.ts
import { formatDate, getDateFromString, getPreviousDay, getThirtyDaysAgo, getToday } from '@/lib/date/utils';
import useSWR from 'swr';
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const today = getDateFromString(getToday());
const thirtyDaysAgo = getDateFromString(getThirtyDaysAgo());

export function useAnalyticsData(spaceId: string, eventType: 'submit' | 'visit', visitType?: string) {
  const searchParams = useSearchParams();
  const start = searchParams.get("start")
    ? getDateFromString(searchParams.get("start")!)
    : thirtyDaysAgo;
  const end = searchParams.get("end")
    ? getDateFromString(searchParams.get("end")!)
    : today;
  
  const formattedStart = formatDate(start)
  const formattedEnd = formatDate(end)
  const { data, error } = useSWR(
    eventType === 'submit' 
      ? `/api/analytics/feedback?spaceId=${spaceId}&start=${formattedStart}&end=${formattedEnd}`
      : `/api/analytics/feedback/visits?spaceId=${spaceId}&pageType=${visitType}&start=${formattedStart}&end=${formattedEnd}`,
    fetcher,
    {
      dedupingInterval: 60000,
      revalidateOnFocus: false,
    }
  );

  return {
    data: transformData(data, eventType),
    isLoading: !error && !data,
    isError: error,
  };
}

function transformData(data: any, eventType: 'submit' | 'visit') {
  if (!data) return { chartData: [], metadata: [] };
  
  const chartData = Object.entries(data[eventType === 'submit' ? 'feedbacks' : 'visits'])
    .map(([name, value]) => ({ name, value: value as number }));
    
  if (chartData.length === 1) {
    chartData.unshift({ 
      name: getPreviousDay(chartData[0].name), 
      value: 0 
    });
  }

  const metadata = Object.entries(data.metadata).map(([category, values]) => ({
    category,
    data: Object.entries(values as Record<string, number>).map(([name, value]) => ({
      name,
      value,
    })),
  }));

  return { chartData, metadata };
}