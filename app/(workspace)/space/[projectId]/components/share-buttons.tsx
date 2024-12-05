"use client";
import QRCode from "react-qr-code";
import { Copy, Share2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function ShareButtons({
  url,
  text,
}: {
  url: string;
  text: string;
}) {
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            {text}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{text}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input value={url} readOnly className="flex-1" />
              <Button onClick={copyToClipboard} className="w-full sm:w-auto">
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <div className="flex justify-center bg-white p-4 rounded-lg">
              <QRCode value={url} size={200} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Get QR Page
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center bg-white p-4 rounded-lg">
            <QRCode value={url} size={300} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
