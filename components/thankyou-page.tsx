"use client"
// pages/index.js
import { SpaceFormType } from "@/app/(workspace)/space/[projectId]/settings/schema";
import { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";

export type ThankYouPageProps = SpaceFormType["thankYouPageSchema"];

export default function ThankYouPage({ message, title }: ThankYouPageProps) {
  const [runConfetti, setRunConfetti] = useState(true);
  const [numberOfPieces, setNumberOfPieces] = useState(600); // Start with 600 pieces of confetti
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const confettiRef = useRef<HTMLDivElement | null>(null); // Ref for the parent container

  useEffect(() => {
    // Set initial dimensions for confetti based on the parent container size
    const parentElement = confettiRef.current;
    if (parentElement) {
      setDimensions({
        width: parentElement.offsetWidth,
        height: parentElement.offsetHeight,
      });
    }

    const interval = setInterval(() => {
      setNumberOfPieces((prev) => prev - 10);
    }, 300);

    // Handle resize to adjust confetti dimensions based on the parent container
    const handleResize = () => {
      if (parentElement) {
        setDimensions({
          width: parentElement.offsetWidth,
          height: parentElement.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener and interval
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={confettiRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {runConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={numberOfPieces}
          style={{ position: "absolute" }}
        />
      )}
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600">{message}</p>
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-32 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
