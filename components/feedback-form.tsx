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
import { SpaceFormType } from "@/app/(workspace)/space/[projectId]/settings/schema";
import { submitFeedback } from "@/lib/common/submitFeedback";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";

type DetailsProps = Pick<
  SpaceFormType["landingPageSchema"],
  "name" | "logo" | "message"
>;
type FeedbackFormProps = SpaceFormType["settingsSchema"] & {
  spaceDetails: DetailsProps;
  spaceId: string; // Added missing spaceId prop
};

export default function FeedbackForm({
  authEnabledReview,
  ipEnabledReview,
  nameRequired,
  starRatingRequired,
  spaceDetails,
  spaceId,
}: FeedbackFormProps) {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { name: spaceName, logo, message } = spaceDetails;
  const {projectId} = useParams()
  const router = useRouter()
  const newThankYouPath = `/${projectId}/thank-you`
  const redirectToThankYouPage = ()=> router.replace(newThankYouPath)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (nameRequired && !name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!feedback.trim()) {
      toast({
        title: "Error",
        description: "Please provide feedback",
        variant: "destructive",
      });
      return;
    }

    if (starRatingRequired && !rating) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await submitFeedback({
        spaceId,
        feedback: feedback.trim(),
        stars: starRatingRequired ? rating : undefined,
        name: nameRequired ? name.trim() : undefined,
      });
  
      toast({
        title: "Success",
        description: "Thank you for your feedback!"
      });
      setName("");
      setFeedback("");
      setRating(1);
      redirectToThankYouPage()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-h-[80vh] overflow-y-scroll md:overflow-hidden max-w-2xl w-full mx-auto">
      <CardHeader className="text-center">
        <div className="w-20 h-20 mx-auto my-7">
          <Avatar className="rounded-full size-32">
            <AvatarImage
              className="aspect-square rounded-full"
              src={logo as string}
              alt={spaceName}
            />
            <AvatarFallback>{spaceName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-3xl font-bold">{spaceName}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 h-full">
          {nameRequired && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= rating
                          ? "text-orange-400 fill-orange-400"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      </CardContent>
      <div className="flex justify-center items-center mb-3 -mt-3">
        <Branding />
      </div>
    </Card>
  );
}