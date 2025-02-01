import { Card } from "@/components/ui/card";
import { useSpaceEventAnalytics } from "../services/useSpaceEventAnalytics";
import Loader from "../loader";

export default function TotalFeedback({ spaceId }: { spaceId: string }) {
  const { data, error, isLoading } = useSpaceEventAnalytics(spaceId);

  if (error)
    return (
      <Card className="w-full h-20 bg-gray-200 animate-pulse rounded-lg" />
    );

  const count = data?.total_feedback || 0;

  return (
    <Card className="shadow-none p-4 flex items-center justify-between w-full sm:w-52">
      <div>
        <p className="text-sm text-muted-foreground text-wrap">
          Total Feedbacks
        </p>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {isLoading ? <Loader /> : <span>{count}</span>}
          {/* Dot styled as a div with h-6 and w-6 */}
          <div className="bg-green-500 h-3 w-3 rounded-full animate-pulse" />
        </h2>
      </div>
    </Card>
  );
}