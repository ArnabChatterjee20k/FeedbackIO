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
import { importTweet } from "../../../actions/social-import";
import { useRef, useTransition } from "react";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function ImportDialog({filled}:{filled?:boolean}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { projectId } = useParams();
  const ref = useRef<null | HTMLInputElement>(null);
  async function handleImport() {
    startTransition(async () => {
      const url = ref.current?.value;
      if (!url) return;
      const { error } = await importTweet(url, projectId as string);
      if (error){
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
      }
      return
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={filled?"default":"outline"}>Import tweets</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Twitter Import</DialogTitle>
          <DialogDescription>
            Make sure to enter the valid public tweet url
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-start">
            <Input
              ref={ref}
              id="name"
              placeholder="https://x.com/arnabch20k/status/1805534428149727399"
              className="col-span-3"
            />
            <p className="text-sm my-2">Paste your tweet url here</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleImport} type="submit" disabled={isPending}>
            {isPending ? "Starting..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
