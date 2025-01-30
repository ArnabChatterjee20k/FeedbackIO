"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
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
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <AreaChart
        data={data}
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
          domain={data.length === 0 ? ["dataMin - 0.1", "auto"] : undefined}
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          fill={color ? color : "#ED9E88"}
          stroke={stroke ? stroke : "#ED9E88"}
          fillOpacity={0.3} // Adjust fill opacity for a lighter look
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
