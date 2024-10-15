import {Heart} from "lucide-react"
export default function Logo() {
    return (
      <>
        <div className="relative h-10 w-10 bg-gradient-to-b from-[#EA580C] to-[#DEA78B] rounded-full flex">
        <Heart width={32} className="fill-gray-800 absolute top-[0.65rem] left-1" stroke="transparent"/>
        </div>
      </>
    );
  }