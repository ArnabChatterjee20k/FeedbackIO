import ChartCard from "@/components/analytics/ChartCard";
import { TriangleAlert } from "lucide-react";
export default function ErrorMessage() {
  return (
    <div className="flex flex-col w-full items-center text-center gap-4">
      <TriangleAlert color="red" />
      <p className="text-red-500 font-medium">Some problem occured!</p>
    </div>
  );
}
