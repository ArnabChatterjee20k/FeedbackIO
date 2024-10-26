import { Heart } from "lucide-react";

export default function Logo() {
  return (
    <div className="relative h-10 w-10 bg-gradient-to-b from-[#333333] to-[#000000] rounded-full flex items-center justify-center">
      <Heart width={24} height={24} className="fill-white" stroke="transparent" />
    </div>
  );
}
