"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

export function DownloadAsImageButton() {
  const handleDownload = async () => {
    const element = document.getElementById("wall-of-fame");
    if (!element) return;
    window.requestAnimationFrame(async () => {
      // Get the actual width of the element
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
            // Force all images to load before capture
            const images = clonedElement.getElementsByTagName("img");
            Array.from(images).forEach((img) => {
              if (img.complete) return;
              img.src = img.src;
            });
          }
        },
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = "wall-of-fame.png";
      link.click();
    });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" /> Download as Image
    </Button>
  );
}
