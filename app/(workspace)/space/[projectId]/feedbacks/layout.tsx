import AddMembers from "@/app/(workspace)/space/[projectId]/feedbacks/component/add-members-modal/add-members";
import { PropsWithChildren } from "react";
import MembersList from "./component/add-members-modal";

interface LayoutProps {
  params: { projectId: string };
  children: PropsWithChildren["children"];
}
export default function layout({ children, params }: LayoutProps) {
  return (
    <section>
      <div className="flex flex-1 flex-col items-end gap-4 p-4 pt-0 pb-1 mx-auto container">
        <MembersList projectId={params.projectId}/>
      </div>
      {children}
    </section>
  );
}
