"use client";
import { useMemo, memo } from "react";
import BarItem from "./BarItem";

export interface VerticalBarChartData {
  name: string;
  value: number;
  fill: "#ffcdd2" | "#c5cae9" | "#bbdefb";
  active?: boolean;
  redirectionLink?: string;
}

export interface Props {
  data: VerticalBarChartData[];
}

export default function VerticalBarChart({ data }: Props) {
  const dataMax = useMemo(
    () => Math.max(...data.map(({ value }) => value)),
    [data]
  );

  return (
    <div className="space-y-4">
      {data.map((stat) => (
        <BarItem
          active={stat.active}
          hover={true}
          key={stat.name}
          stat={stat}
          dataMax={dataMax}
          redirectionLink={stat.redirectionLink}
        />
      ))}
    </div>
  );
}
