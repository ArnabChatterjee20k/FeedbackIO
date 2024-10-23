"use client";
import { Button } from "@/components/ui/button";
import RetroGrid from "@/components/ui/retro-grid";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Alex Johnson",
    handle: "alexjohnson",
    content:
      "This feedback tool has revolutionized our customer engagement! The insights we've gained are incredible.",
    likes: 1.5,
    comments: 234,
    views: 4.6,
  },
  {
    name: "Sarah Lee",
    handle: "sarahlee",
    content:
      "Collecting testimonials has never been easier. Highly recommended! Perfect for our marketing team's needs.",
    likes: 2.1,
    comments: 186,
    views: 5.2,
  },
  {
    name: "Mike Chen",
    handle: "mikechen",
    content:
      "The AI-powered insights have been a game-changer for our business. We've improved our product significantly.",
    likes: 1.8,
    comments: 210,
    views: 3.9,
  },
  {
    name: "Emily Taylor",
    handle: "emilytaylor",
    content:
      "Intuitive interface and powerful analytics. Love it! The export features are particularly useful.",
    likes: 1.3,
    comments: 158,
    views: 3.7,
  },
];

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <RetroGrid />

      {/* Background cards - Hidden on mobile, shown on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 hidden lg:block">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.handle}
              className={`absolute ${getCardPosition(index)}`}
              {...testimonial}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 md:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
          Collect Feedback
          <br />
          <span className="text-primary">Way Faster</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          The ultimate tool for gathering and managing customer feedback and
          testimonials. Launch your feedback collection in minutes.
        </p>
        <Link href="/dashboard">
          <Button
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 md:px-8 py-4 md:py-6 text-base md:text-lg font-medium"
          >
            Get Started
          </Button>
        </Link>
        {/* Features list */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-sm md:text-base text-gray-600 max-w-xl mx-auto">
          {[
            "Easy Integration",
            "Real-time Analytics",
            "Customizable Forms",
            "AI-powered Insights",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center justify-center space-x-2 p-2"
            >
              <Check className="h-5 w-5 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  className,
  name,
  handle,
  content,
  likes,
  comments,
  views,
}: {
  className?: string;
  name: string;
  handle: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
}) {
  return (
    <div
      className={`bg-white p-4 md:p-6 rounded-xl shadow-lg w-full md:w-96 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center mb-3">
        <div className="w-10 md:w-12 h-10 md:h-12 bg-gray-200 rounded-full mr-3 flex-shrink-0" />
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">@{handle}</div>
        </div>
      </div>
      <div className="text-gray-800 mb-4 text-left leading-relaxed text-sm md:text-base">
        {content}
      </div>
    </div>
  );
}

// Helper function to position cards on desktop
function getCardPosition(index: number): string {
  const positions = [
    "top-12 left-12 transform -rotate-3 hover:rotate-0 transition-transform",
    "top-20 right-20 transform rotate-2 hover:rotate-0 transition-transform",
    "bottom-24 left-24 transform rotate-3 hover:rotate-0 transition-transform",
    "bottom-16 right-16 transform -rotate-2 hover:rotate-0 transition-transform",
  ];
  return positions[index] || "";
}
