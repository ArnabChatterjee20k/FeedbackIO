import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Flame } from "lucide-react";
import React from "react";

interface Props {
  type: "feedback" | "social-media";
  id: string;
}

export default function AddToWallOfFame() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Flame
            strokeWidth={1.12}
            className="ml-auto hover:fill-orange-400 hover:stroke-orange-400"
          />
        </TooltipTrigger>
        <TooltipContent>Add to wall of fame</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
