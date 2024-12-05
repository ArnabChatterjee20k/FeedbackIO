import { AppSidebar } from "@/app/(workspace)/space/[projectId]/components/Sidebar";
import { getUser } from "@/lib/server/utils";
import { Space, User } from "./types/navTypes";
import { getSpace } from "@/lib/server/db/spaces";
import { redirect } from "next/dist/server/api-utils";
import { notFound } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const user = await getUser();
  const userDetails: User = {
    email: user?.email as string,
    name: user?.name as string,
  };
  const space = await getSpace(user?.$id as string, params.projectId);
  if (!space) return notFound();
  const spaceDetails: Space = {
    logo: space.logo,
    name: space.name,
    plan: "free",
  };
  const mainUrl = `/space/${params.projectId}`;
  return (
    <AppSidebar mainUrl={mainUrl} space={spaceDetails} user={userDetails}>
      {children}
    </AppSidebar>
  );
}
