"use client";

import { useMemo } from "react";
function calculatePercentage(total: number, value: number) {
  return (value / total) * 100;
}

export interface BarProps {
  name: string;
  value: number;
  fill: "#ffcdd2" | "#c5cae9" | "#bbdefb";
}

const BarItem = ({
  stat,
  dataMax,
  hover
}: {
  stat: BarProps;
  dataMax: number;
  hover?:boolean
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
    <button
      className={`group flex items-center w-full gap-4 relative rounded-sm pr-2 ${
        hover ? "hover:bg-slate-100" : ""
      }`}
    >
      <span
        className={`absolute inset-0 scale-x-0 w-2 -left-4 rounded-sm ${
          hover ? "group-hover:scale-x-100" : ""
        }`}
        style={{ backgroundColor: barStyle.backgroundColor }}
      ></span>
      <div className="relative text-sm font-mono py-2 px-3 flex-1 text-left rounded-sm">
        <span
          className={`inset-0 flex-1 text-left rounded-sm absolute ${hover?"group-hover:brightness-90":""}`}
          style={barStyle}
        />
        <span className="relative text-black">{stat.name}</span>
      </div>
      <span className="font-semibold w-14 text-wrap text-right">
        {stat.value}
      </span>
    </button>
  );
};

export default BarItem;
