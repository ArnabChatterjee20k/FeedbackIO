"use client";
import type { VisitType } from "@/lib/analytics/types";
import { useEffect } from "react";

// Fires from the browser so the visit is recorded with the visitor's
// IP / user agent (the pages themselves are server rendered and cached).
export default function VisitTracker({
  spaceId,
  pageType,
}: {
  spaceId: string;
  pageType: VisitType;
}) {
  useEffect(() => {
    fetch("/api/analytics/feedback/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spaceId,
        pageType,
        referrer: document.referrer,
      }),
      keepalive: true,
    }).catch((error) =>
      console.error({ message: "Error posting visit analytics", error })
    );
  }, [spaceId, pageType]);
  return null;
}
