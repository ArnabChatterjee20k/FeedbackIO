"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

export function DownloadAsImageButton({
  downloadImageSectionId,
}: {
  downloadImageSectionId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(downloadImageSectionId);
    if (!element) return;

    setLoading(true); // Start loading animation
    window.requestAnimationFrame(async () => {
      try {
        const actualWidth = element.offsetWidth;

        const canvas = await html2canvas(element, {
          scale: 7,
          width: actualWidth,
          height: element.scrollHeight,
          windowWidth: actualWidth,
          windowHeight: element.scrollHeight,
          useCORS: true,
          allowTaint: true,
          logging: true,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById("wall-of-fame");
            if (clonedElement) {
              clonedElement.style.width = `${actualWidth}px`;
              clonedElement.style.columns = "4";
              clonedElement.style.columnGap = "1rem";

              const images = clonedElement.getElementsByTagName("img");
              Array.from(images).forEach((img) => {
                if (!img.complete) img.src = img.src;
              });
            }
          },
        });

        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = image;
        link.download = "wall-of-fame.png";
        link.click();
      } catch (error) {
        console.error("Download failed", error);
      } finally {
        setLoading(false); // Stop loading animation
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full"></span>
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {loading ? "Downloading..." : "Download as Image"}
    </Button>
  );
}
