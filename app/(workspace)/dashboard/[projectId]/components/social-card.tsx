import React, { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Linkedin, Twitter } from "lucide-react";

interface SocialPost {
  space_id: string;
  userProfilePicture?: string;
  type: string;
  url: string;
  content?: string;
  contentImage?: string;
  tag?: string;
  name?: string;
  wall_of_fame?: boolean;
}

interface SocialCardProps {
  post: SocialPost;
  className?: string;
}

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("rounded-md bg-primary/10", className)} {...props} />
  );
};

const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

const SocialIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case "twitter":
      return <Twitter className="size-5 text-[#3BA9EE] transition-all ease-in-out hover:scale-105" />;
    case "linkedin":
      return <Linkedin className="size-5 text-[#0A66C2] transition-all ease-in-out hover:scale-105" />;
    default:
      return null;
  }
};

const CardHeader = ({ post }: { post: SocialPost }) => (
  <div className="flex flex-row justify-between tracking-tight">
    <div className="flex items-center space-x-2">
      <a href={post.url} target="_blank" rel="noreferrer">
        <img
          src={post.userProfilePicture || "/api/placeholder/48/48"}
          alt={`${post.name}'s profile`}
          height={48}
          width={48}
          className="overflow-hidden rounded-full border border-transparent"
        />
      </a>
      <div>
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center whitespace-nowrap font-semibold"
        >
          {truncate(post.name, 20)}
          {post.wall_of_fame && (
            <span className="ml-1 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
              Wall of Fame
            </span>
          )}
        </a>
        {post.tag && (
          <div className="text-sm text-gray-500">
            {truncate(post.tag, 30)}
          </div>
        )}
      </div>
    </div>
    <a href={post.url} target="_blank" rel="noreferrer">
      <span className="sr-only">View original post</span>
      <SocialIcon type={post.type} />
    </a>
  </div>
);

const CardBody = ({ post }: { post: SocialPost }) => (
  <div className="break-words leading-normal tracking-tighter">
    <p className="text-sm font-normal whitespace-pre-wrap">
      {truncate(post.content, 280)}
    </p>
  </div>
);

const CardMedia = ({ post }: { post: SocialPost }) => (
  post.contentImage && (
    <div className="flex flex-1 items-center justify-center">
      <img
        src={post.contentImage}
        alt={post.content || "Post image"}
        className="h-64 w-full rounded-xl border object-cover shadow-sm"
      />
    </div>
  )
);

export const SocialMediaCard = ({ post, className }: SocialCardProps) => {
  return (
    <div
      className={cn(
        "relative flex size-full max-w-lg flex-col gap-2 overflow-hidden rounded-lg border p-4 backdrop-blur-md",
        className
      )}
    >
      <CardHeader post={post} />
      <CardBody post={post} />
      <CardMedia post={post} />
    </div>
  );
};

const CardSkeleton = () => (
  <div className="relative flex size-full max-w-lg flex-col gap-4 overflow-hidden rounded-lg border p-4">
    <div className="flex items-center space-x-2">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export const SocialCard = ({
  post,
  fallback = <CardSkeleton />,
  ...props
}: SocialCardProps) => {
  if (!post) return null;

  return (
    <Suspense fallback={fallback}>
      <SocialMediaCard post={post} {...props} />
    </Suspense>
  );
};

export default SocialCard;