import AddMembers from "@/components/add-members";
import { PropsWithChildren } from "react";

export default function layout({ children }: PropsWithChildren) {
  return (
    <section>
      <div className="flex flex-1 flex-col items-end gap-4 p-4 pt-0 pb-1 mx-auto container">
        <AddMembers/>
      </div>
      {children}
    </section>
  );
}
