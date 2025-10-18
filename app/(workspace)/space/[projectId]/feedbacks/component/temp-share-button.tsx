"use client";
import { useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import generateAccessToken from "../actions/generate-access-token-action";

export default function TempShareButton({ url }: { url: string }) {
  const [tokenUrl, setTokenUrl] = useState<string | null>(null);
  const [expiryHours, setExpiryHours] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const copyToClipboard = () => {
    if (!tokenUrl) return;
    navigator.clipboard
      .writeText(tokenUrl)
      .then(() => alert("Link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  const generateToken = async () => {
    setLoading(true);
    try {
      const token = await generateAccessToken(expiryHours);
      setTokenUrl(`${url}?share-token=${token}`);
    } catch (err) {
      console.error("Failed to generate token:", err);
      alert("Failed to generate token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" /> Share Temporary Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Temporary Share Link</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 p-4">
          {/* Expiry input */}
        <p className="text-sm font-medium w-full sm:w-auto">Link Expiry Time (hours):</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Input
              type="number"
              min={1}
              value={expiryHours}
              onChange={(e) => setExpiryHours(Number(e.target.value))}
              className="w-full sm:w-24"
            />
            <Button onClick={generateToken} disabled={loading} className="mt-2 sm:mt-0">
              {loading ? "Generating..." : "Generate Token"}
            </Button>
          </div>

          {/* Generated token */}
          {tokenUrl && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Input value={tokenUrl} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} className="mt-2 sm:mt-0">
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
