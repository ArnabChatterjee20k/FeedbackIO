import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

interface Props{
    name:string,
    feedbacks:number,
    sentiment:"POSITIVE"|"NEGATIVE"|"NEUTRAL",
    logo:string
}

type Sentiment = Pick<Props, "sentiment">;

function getSentimentSymbol(emotion: Sentiment): string {
    switch (emotion.sentiment) {
        case "POSITIVE":
            return "😊";
        case "NEGATIVE":
            return "😞";
        case "NEUTRAL":
            return "😐";
        default:
            return "";
    }
}
export default function Card({name,feedbacks,logo}:Props) {
  return (
    <div className="w-96 bg-white cursor-pointer border border-gray-200 hover:shadow-sm transition-all mb-4 min-h-[140px] rounded-md  p-8 md:mb-0 flex flex-col justify-between">
      <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={logo} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold">
            {name}
          </h2>
      </div>
      <p className="text-default">
        Users Engaged: {feedbacks}
      </p>
    </div>
  );
}
