// hooks/useAnalytics.ts
import { getPreviousDay, getThirtyDaysAgo, getToday } from '@/lib/date/utils';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAnalyticsData(spaceId: string, eventType: 'submit' | 'visit', visitType?: string) {
  const start = getThirtyDaysAgo();
  const end = getToday();
  
  const { data, error } = useSWR(
    eventType === 'submit' 
      ? `/api/analytics/feedback?spaceId=${spaceId}&start=${start}&end=${end}`
      : `/api/analytics/feedback/visits?spaceId=${spaceId}&pageType=${visitType}&start=${start}&end=${end}`,
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