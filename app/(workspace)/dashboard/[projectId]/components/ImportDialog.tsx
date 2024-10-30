"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { importTweet, importLinkedIn } from "../actions/social-import"; // Adjust this import if needed
import { useRef, useTransition } from "react";
import { useParams, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ImportDialogProps {
  platform: "twitter" | "linkedin";
  filled?: boolean;
}

export function ImportDialog({ platform, filled }: ImportDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { projectId } = useParams();
  const ref = useRef<HTMLInputElement>(null);
  const pathname = usePathname()
  async function handleImport() {
    startTransition(async () => {
      const url = ref.current?.value;
      if (!url) return;

      let importFunction;
      let errorPrefix = "";
      
      // Determine platform-specific import function and error message prefix
      if (platform === "twitter") {
        importFunction = importTweet;
        errorPrefix = "Tweet";
      } else {
        importFunction = importLinkedIn;
        errorPrefix = "LinkedIn post";
      }

      const { error } = await importFunction(url, projectId as string,pathname);

      if (error) {
        toast({
          title: `Error importing ${errorPrefix}`,
          description: error,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{`Import ${platform === "twitter" ? "Tweet" : "LinkedIn Post"}`}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`${platform === "twitter" ? "Twitter" : "LinkedIn"} Import`}</DialogTitle>
          <DialogDescription>
            {`Make sure to enter a valid public ${platform === "twitter" ? "Tweet" : "LinkedIn post"} URL.`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="url">Paste your URL here</Label>
          <Input ref={ref} id="url" placeholder={`Enter ${platform === "twitter" ? "Tweet" : "LinkedIn post"} URL`} />
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={isPending}>
            {isPending ? "Starting..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
