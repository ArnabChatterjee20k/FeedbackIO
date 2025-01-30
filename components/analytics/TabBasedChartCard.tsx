"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import BarItem from "./BarItem";

interface Data {
  category: string;
  data: { name: string; value: number }[];
}

interface TabBasedChartCardProps {
  data: Data[];
}

export function TabBasedChartCard({ data }: TabBasedChartCardProps) {
  const tabs = data.map(({ category }) => category);
  const [activeTab, setActiveTab] = useState(data[0].category);

  const activeIndex = tabs.indexOf(activeTab);

  const tabContent = useMemo(() => {
    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
          No data available
        </div>
      );
    }

    const content = data.find(({ category }) => category === activeTab);
    const highestValue = Math.max(...(content?.data?.map(({ value }) => value) || [1]));

    return (
      <div className="p-4 space-y-3">
        {content?.data?.map(({ name, value }) => (
          <BarItem dataMax={highestValue} stat={{name,value,fill:"#bbdefb"}}/>
        ))}
      </div>
    );
  }, [data, activeTab]);

  return (
    <Card className="w-full shadow-none">
      <CardContent className="p-0">
        <div className="relative flex items-center justify-between border-b px-4 py-2">
          <div className="relative flex space-x-4 w-full">
            {tabs.map((tab, index) => (
              <div key={tab} className="relative">
                <button
                  onClick={() => setActiveTab(tab)}
                  className="relative z-10 px-3 py-1.5 text-sm font-medium transition"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {tab}
                </button>
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-sm"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div>{tabContent}</div>
      </CardContent>
    </Card>
  );
}
