"use client";

import { useRouter } from "next/navigation";
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
  hover,
  active,
  redirectionLink,
}: {
  stat: BarProps;
  dataMax: number;
  hover?: boolean;
  active?: boolean;
  redirectionLink?: string;
}) => {
  const percentage = calculatePercentage(dataMax, stat.value);
  const router = useRouter();

  function redirect() {
    if (redirectionLink) router.push(redirectionLink);
  }

  const barStyle = useMemo(
    () => ({
      width: `${percentage}%`,
      backgroundColor: stat.fill,
    }),
    [percentage, stat.fill]
  );

  return (
    <button
      onClick={redirect}
      className={`group flex items-center w-full gap-4 relative rounded-sm pr-2 ${
        hover ? "hover:bg-slate-100" : ""
      } ${active ? "bg-slate-100" : ""}`}
    >
      <span
        className={`absolute inset-0 scale-x-0 w-2 -left-4 rounded-sm ${
          active ? "scale-x-100" : ""
        }`}
        style={{ backgroundColor: barStyle.backgroundColor }}
      ></span>
      <div className="relative text-sm font-mono py-2 px-3 flex-1 text-left rounded-sm">
        <span
          className={`inset-0 flex-1 text-left rounded-sm absolute ${
            hover ? "group-hover:brightness-90" : ""
          } ${active ? "brightness-90" : ""}`}
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
