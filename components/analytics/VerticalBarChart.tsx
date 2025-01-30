"use client";
import { useMemo, memo } from "react";

export interface VerticalBarChartData {
  name: string;
  value: number;
  fill: "#ffcdd2" | "#c5cae9" | "#bbdefb";
}

export interface Props {
  data: VerticalBarChartData[];
}

function calculatePercentage(total: number, value: number) {
  return (value / total) * 100;
}

const BarItem = ({
  stat,
  dataMax,
}: {
  stat: VerticalBarChartData;
  dataMax: number;
}) => {
  const percentage = calculatePercentage(dataMax, stat.value);

  const barStyle = useMemo(
    () => ({
      width: `${percentage}%`,
      backgroundColor: stat.fill,
    }),
    [percentage, stat.fill]
  );

  return (
    <button className="group flex items-center w-full gap-4 relative hover:bg-slate-100 rounded-sm pr-2">
      <span
        className="absolute inset-0 scale-x-0 w-2 -left-4 rounded-sm group-hover:scale-x-100"
        style={{ backgroundColor: barStyle.backgroundColor }}
      ></span>
      <div className="relative text-sm font-mono py-2 px-3 flex-1 text-left rounded-sm">
        <span
          className="inset-0 flex-1 text-left rounded-sm absolute group-hover:brightness-110"
          style={barStyle}
        />
        <span className="relative text-black group-hover:font-bold">
          {stat.name}
        </span>
      </div>
      <span className="font-semibold w-14 text-wrap text-right">
        {stat.value}
      </span>
    </button>
  );
};

export default function VerticalBarChart({ data }: Props) {
  const dataMax = useMemo(
    () => Math.max(...data.map(({ value }) => value)),
    [data]
  );

  return (
    <div className="space-y-4">
      {data.map((stat) => (
        <BarItem key={stat.name} stat={stat} dataMax={dataMax} />
      ))}
    </div>
  );
}
