"use client";

import { LineChart, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function EmptyState({ spaceId }: { spaceId: string }) {
  const copyLink = async () => {
    const link = `${window.location.origin}/${spaceId}/landing-page`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Landing page link copied");
    } catch {
      toast.error(`Couldn't copy. Your link is ${link}`);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted text-muted-foreground">
        <LineChart className="h-5 w-5" />
      </div>
      <h3 className="text-[15px] font-bold">
        No visits or feedback in this range yet
      </h3>
      <p className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
        Numbers show up here within a few minutes of someone opening your
        landing page or wall of fame. Share your landing page to get the first
        ones.
      </p>
      <Button variant="link" className="font-bold" onClick={copyLink}>
        Copy landing page link
      </Button>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-card px-5 py-12 text-center">
      <TriangleAlert className="h-6 w-6 text-red-600" />
      <h3 className="text-[15px] font-bold">Analytics couldn&apos;t load</h3>
      <p className="max-w-[50ch] text-sm text-muted-foreground">
        The analytics service didn&apos;t respond. Try again in a moment. If
        it keeps happening, check that the Appwrite Analytics property and API
        key are set up.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
