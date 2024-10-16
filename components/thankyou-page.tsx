// pages/index.js
import { useState, useEffect } from "react";
import Confetti from "react-confetti";

export default function ThankYouPage() {
  const [runConfetti, setRunConfetti] = useState(true);
  const [numberOfPieces, setNumberOfPieces] = useState(600); // Start with 200 pieces of confetti
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    // Set initial dimensions for confetti based on window size
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const interval = setInterval(() => {
      setNumberOfPieces((prev) => prev - 10);
    }, 300);

    // Handle window resize to adjust confetti dimensions
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener, interval, and timeout
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {runConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={numberOfPieces}
          style={{ position: "absolute" }}
        />
      )}
      <div className="w-full flex items-center justify-center mt-32 overflow-hidden">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4">
            Thank You!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            We appreciate your feedback!
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-1 w-32 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}
