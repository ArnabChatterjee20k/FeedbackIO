import React, { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import AddToWallOfFame from "./add-to-wall-of-flame";

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
  id?: string;
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

const truncate = (str?: string | null, length?: number) => {
  if (!length) return;
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

const SocialIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case "twitter":
      return (
        <Twitter className="size-5 text-[#3BA9EE] hover:fill-[#3BA9EE] transition-all ease-in-out hover:scale-105" />
      );
    case "linkedin":
      return (
        <Linkedin className="size-5 text-[#0A66C2] hover:fill-[#0A66C2] transition-all ease-in-out hover:scale-105" />
      );
    default:
      return null;
  }
};

const CardHeader = ({ post }: { post: SocialPost }) => (
  <div className="flex flex-row justify-between tracking-tight">
    <div className="flex items-center space-x-2">
      <div>
        {post.userProfilePicture ? (
          <img
            src={post.userProfilePicture || "/api/placeholder/48/48"}
            alt={`${post.name}'s profile`}
            height={48}
            width={48}
            className="overflow-hidden rounded-full border border-transparent"
          />
        ) : (
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full animate-pulse" />
            <p>Import going on...</p>
          </div>
        )}
      </div>
      <div>
        <p className="flex items-center whitespace-nowrap font-semibold">
          {truncate(post.name, 20)}
        </p>
        {post.tag && (
          <div className="text-sm text-gray-500">{truncate(post.tag, 30)}</div>
        )}
      </div>
    </div>
    <div className="flex items-center -mt-1 gap-2">
      {post.id ? (
        <AddToWallOfFame
          id={post.id}
          type={post.type as "twitter" | "linkedin"}
          wallOfFame={post.wall_of_fame as boolean}
        />
      ) : null}
      <Link href={post.url}>
        <span className="sr-only">View original post</span>
        <SocialIcon type={post.type} />
      </Link>
    </div>
  </div>
);

const CardBody = ({ post }: { post: SocialPost }) => (
  <div className="break-words leading-normal tracking-tighter">
    <p className="text-sm font-medium whitespace-pre-wrap">
      {truncate(post.content, 400)}
    </p>
  </div>
);

const CardMedia = ({ post }: { post: SocialPost }) =>
  post.contentImage && (
    <div className="flex flex-1 items-center justify-center">
      <img
        src={post.contentImage}
        alt={post.content || "Post image"}
        className="h-40 w-full rounded-xl border object-cover shadow-sm"
      />
    </div>
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
      {post.contentImage && <CardMedia post={post} />}
    </div>
  );
};

export const SocialCard = ({ post, ...props }: SocialCardProps) => {
  if (!post) return null;
  return <SocialMediaCard post={post} {...props} />;
};

export default SocialCard;
