"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Copy, Code, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface APIKeyData {
  apiKeyid: string;
  api_key: string;
  createdAt: string;
  space_id: string;
}

function ApiKeySnippetDialog({ spaceId,apiKey }: {spaceId:string, apiKey: string }) {
  const { toast } = useToast();
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://your-app-url.com");
  const apiUrl = `${baseUrl}/api/${spaceId}/feedback?apiKey=${apiKey}`;

  const curlSnippet = `curl -X POST ${apiUrl} \\
  -H "Content-Type: application/json" \\
  -d '{
    "feedback": "Your feedback here",
    "name": "John Doe",
    "email": "john@example.com",
    "stars": 5
  }'`;

  const fetchSnippet = `fetch("${apiUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    feedback: "Your feedback here",
    name: "John Doe",
    email: "john@example.com",
    stars: 5
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));`;

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code snippet copied to clipboard",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 hover:bg-background"
          aria-label="View API Snippet"
        >
          <Code className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">API Request Snippet</DialogTitle>
          <DialogDescription>
            Copy and use these code snippets to integrate feedback collection into your application
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold">cURL</label>
                <p className="text-xs text-muted-foreground">Command line example</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copySnippet(curlSnippet)}
                className="gap-2"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <pre className="p-4 bg-muted/50 rounded-lg overflow-x-auto text-sm border font-mono">
                <code className="text-foreground">{curlSnippet}</code>
              </pre>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-semibold">JavaScript (fetch)</label>
                <p className="text-xs text-muted-foreground">Browser or Node.js example</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copySnippet(fetchSnippet)}
                className="gap-2"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <pre className="p-4 bg-muted/50 rounded-lg overflow-x-auto text-sm border font-mono">
                <code className="text-foreground">{fetchSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ApiKeysList({ spaceId, apiKeys }: {spaceId:string, apiKeys: APIKeyData[] }) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  return (
    <div className="space-y-4">
      {apiKeys.map((apiKeyData, index) => (
        <div
          key={apiKeyData.apiKeyid}
          className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
        >
          {/* Gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                  <Key className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Created {new Date(apiKeyData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    API Key #{index + 1}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={apiKeyData.api_key}
                    readOnly
                    className="font-mono text-sm bg-muted/50 border-muted pr-20 cursor-text hover:bg-muted/70 transition-colors"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-background"
                      onClick={() => copyToClipboard(apiKeyData.api_key)}
                      aria-label="Copy API Key"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <ApiKeySnippetDialog spaceId={spaceId} apiKey={apiKeyData.api_key} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

