"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Branding from "./branding";
import { SpaceFormType } from "@/app/(workspace)/dashboard/[projectId]/settings/schema";
type DetailsProps = Pick<
  SpaceFormType["landingPageSchema"],
  "name" | "logo" | "message"
>;
type FeedbackFormProps = SpaceFormType["settingsSchema"] & {
  spaceDetails: DetailsProps;
};
export default function FeedbackForm({
  authEnabledReview,
  ipEnabledReview,
  nameRequired,
  starRatingRequired,
  spaceDetails,
}: FeedbackFormProps) {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ name, feedback, rating });
    // Reset form after submission
    setName("");
    setFeedback("");
    setRating(0);
  };
  const { name: spaceName, logo, message } = spaceDetails;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-20 h-20 mx-auto my-7">
          <Avatar className="rounded-full">
            <AvatarImage
              className="rounded-full"
              src={logo as string}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-3xl font-bold">{spaceName}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {nameRequired && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please enter your feedback here"
              required
              className="min-h-[100px]"
            />
          </div>

          {starRatingRequired && (
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "text-orange-400 fill-orange-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </form>
      </CardContent>
      <div className="flex justify-center items-center mb-3 -mt-3">
        <Branding />
      </div>
    </Card>
  );
}
