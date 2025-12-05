"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createApiKeyAction } from "../actions/create-api-key";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

export function CreateApiKeyButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  async function handleCreateApiKey() {
    startTransition(async () => {
      const { error } = await createApiKeyAction(projectId, pathname);

      if (error) {
        toast({
          title: "Error creating API key",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "API key created successfully",
        });
        router.refresh();
      }
    });
  }

  return (
    <Button 
      onClick={handleCreateApiKey} 
      disabled={isPending}
      className="gap-2 shadow-sm hover:shadow-md transition-shadow"
    >
      <Plus className="h-4 w-4" />
      {isPending ? "Creating..." : "Create API Key"}
    </Button>
  );
}

