"use client";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Flame, Loader2 } from "lucide-react";
import React, { useTransition } from "react";
import addToWallOfFame from "../actions/add-to-wall-of-fame";
import { usePathname } from "next/navigation";

interface Props {
  type: "feedback" | "twitter" | "linkedin";
  id: string;
  wallOfFame: boolean;
}

export default function AddToWallOfFame({ id, type, wallOfFame }: Props) {
  const [isPending, startTransition] = useTransition();
  const path = usePathname();
  async function handleToggle() {
    startTransition(async () => {
      await addToWallOfFame(id, type, !wallOfFame, path);
    });
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Flame
              onClick={handleToggle}
              strokeWidth={1.12}
              className={`"ml-auto ${
                wallOfFame ? "fill-orange-400 stroke-none" : "fill-transparent"
              } hover:fill-orange-400 hover:stroke-orange-400"`}
            />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {isPending ? "Added in wall of fame" : "Add to wall of fame"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
