import { Star } from "lucide-react";
import { cn, generateSecret } from "@/lib/utils";
import GraidentAvatar from "@/components/graident-avatar";
import AddToWallOfFame from "./add-to-wall-of-flame";

export async function Feedbackcard({
  name,
  stars,
  email,
  feedback,
  id,
  wallOfFame
}: {
  name?: string;
  stars?: number;
  email?: string;
  feedback: string;
  id:string;
  wallOfFame:boolean
}) {
  return (
    <figure
      className={cn(
        "relative w-full max-w-sm cursor-pointer overflow-hidden rounded-lg border p-4 transition-colors",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex items-center gap-3">
        <GraidentAvatar id={email || name || generateSecret(8)} />
        <div className="flex flex-col">
          {name ? (
            <figcaption className="text-sm font-medium text-gray-900 dark:text-white">
              {name}
            </figcaption>
          ) : null}
          {email ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
          ) : null}
        </div>
        <span className="inline-block ml-auto">
            <AddToWallOfFame id={id} wallOfFame={wallOfFame} type="feedback"/>
        </span>
      </div>
      {stars ? (
        <div
          className="mt-2 flex items-center"
          aria-label={`Rated ${stars} out of 5 stars`}
        >
          {[...Array(stars)].map((_, index) => (
            <Star
              key={index}
              className={cn(
                "h-4 w-4",
                index < stars
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          ))}
        </div>
      ) : null}
      <blockquote className="mt-3 text-sm text-gray-700 dark:text-gray-300">
        {feedback}
      </blockquote>
    </figure>
  );
}
