"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface AreaChartData {
  name: string;
  value: number;
}

export interface Props {
  data: AreaChartData[];
  color?: string;
  stroke?: string;
}

export default function Chart({ data, color, stroke }: Props) {
  const isEmpty = data.length === 0;
  const dataToShow = isEmpty ? [{ name: 0, value: 0 }] : data;

  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <AreaChart
        data={dataToShow}
        margin={{
          top: 30,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" className="text-xs sm:text-sm" />
        <YAxis
          className="text-xs sm:text-sm"
          domain={isEmpty ? [0, 1] : ["auto", "auto"]} // Ensures Y-axis renders
        />
        <Tooltip />
        {!isEmpty && (
          <Area
            type="monotone"
            dataKey="value"
            fill={color || "#ED9E88"}
            stroke={stroke || "#ED9E88"}
            fillOpacity={0.3}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
