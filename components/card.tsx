import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
interface Props {
  name: string;
  logo?: string;
  icon?: LucideIcon;
  url: string;
}

export default function Card({ name, logo, icon: Icon, url }: Props) {
  return (
    <Link href={url}>
      <div className="w-96 bg-white cursor-pointer border border-gray-200 hover:shadow-sm transition-all mb-4 min-h-[140px] rounded-md  p-8 md:mb-0 flex flex-col justify-between">
        <div className="flex items-center gap-4">
          {logo && (
            <Avatar>
              <AvatarImage src={logo} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          {Icon && (
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
              <Icon className="w-6 h-6 text-gray-600" />
            </div>
          )}
          <h2 className="text-lg font-bold">{name}</h2>
        </div>
      </div>
    </Link>
  );
}
