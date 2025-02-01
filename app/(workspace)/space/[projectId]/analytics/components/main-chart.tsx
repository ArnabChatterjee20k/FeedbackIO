// components/analytics/MainChart.tsx
'use client';

import AreaChart from "@/components/analytics/AreaChart"
import ChartCard from '@/components/analytics/ChartCard';
import { useAnalyticsData } from '../services/useAnalytics';

export function MainChart({ spaceId, eventType, visitType }: { 
  spaceId: string;
  eventType: 'submit' | 'visit';
  visitType?: string;
}) {
  const { data, isLoading } = useAnalyticsData(spaceId, eventType, visitType);

  return (
    <ChartCard>
      <AreaChart data={data.chartData} />
    </ChartCard>
  );
}