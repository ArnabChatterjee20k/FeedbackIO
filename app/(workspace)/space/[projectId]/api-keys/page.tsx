import Empty from "@/components/empty";
import { getAPIKeys } from "@/lib/server/db/api-key";
import { CreateApiKeyButton } from "./create-api-key-button";
import { ApiKeysList } from "./api-keys-list";
import { Key } from "lucide-react";

interface APIKeyData {
  apiKeyid: string;
  api_key: string;
  createdAt: string;
  space_id: string;
}

export default async function Page({
  params,
}: {
  params: { projectId: string };
}) {
  const apiKeys = await getAPIKeys(params.projectId);

  if (!apiKeys) return <h1>Some error occured</h1>;

  if (!apiKeys.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6 max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">No API Keys Yet</h2>
            <p className="text-muted-foreground">
              Create your first API key to start integrating feedback collection into your application
            </p>
          </div>
          <CreateApiKeyButton projectId={params.projectId} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
              <p className="text-sm text-muted-foreground">
                Manage your API keys for programmatic access
              </p>
            </div>
          </div>
        </div>
        <CreateApiKeyButton projectId={params.projectId} />
      </div>

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Keys</p>
              <p className="text-2xl font-bold mt-1">{apiKeys.length}</p>
            </div>
            <Key className="w-8 h-8 text-primary/50" />
          </div>
        </div>
      </div>

      {/* API Keys List */}
      <ApiKeysList spaceId={params.projectId} apiKeys={apiKeys} />
    </div>
  );
}
