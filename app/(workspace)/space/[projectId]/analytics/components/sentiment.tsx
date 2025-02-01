import { Card } from "@/components/ui/card";
import { useSpaceEventAnalytics } from "../services/useSpaceEventAnalytics";
import Loader from "../loader";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Sentiment({ spaceId }: { spaceId: string }) {
  const { data, error, isLoading } = useSpaceEventAnalytics(spaceId);

  if (error)
    return (
      <Card className="w-full h-20 bg-gray-200 animate-pulse rounded-lg" />
    );

  const sentiment = data?.sentiment ?? 0;
  const isPositive = sentiment >= 0.5;

  return (
    <Card className="shadow-none p-4 flex items-center justify-between w-full sm:w-52">
      <div>
        <p className="text-sm text-muted-foreground text-wrap">Overall Sentiment</p>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {isLoading ? (
            <Loader />
          ) : (
            <span>{sentiment.toFixed(2)}</span>
          )}
          {isPositive ? (
            <>
              <TrendingUp className="text-green-500 h-6 w-6" />
            </>
          ) : (
            <>
              <TrendingDown className="text-red-500 h-6 w-6" />
            </>
          )}
        </h2>
      </div>
    </Card>
  );
}
