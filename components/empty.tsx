import { Inbox } from "lucide-react";
import React from "react";
interface Props{
  text?:string,
  children?:React.ReactNode
}
export default function Empty({text,children}:Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Inbox size={150} />
      {text?<p className="text-2xl font-bold">{text}</p>:null}
      {children}
    </div>
  );
}
