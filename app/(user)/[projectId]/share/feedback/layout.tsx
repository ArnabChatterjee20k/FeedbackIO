import React, { PropsWithChildren } from "react";
import checkAccess from "../utils/checkAccess";
import { getUser } from "@/lib/server/utils";
import AuthDialog from "@/components/auth-dialog";
import NoAccess from "../components/NoAccess";
import { verifyAccessToken } from "@/app/(workspace)/space/[projectId]/feedbacks/actions/generate-access-token-action";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SharedFeedbacks from "./[pageId]/page";

interface LayoutProps {
  children: React.ReactNode;
  params: { projectId: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const header = await headers()
  const url = new URL(header.get('x-url') || "")
  const token = url.searchParams.get('share-token')
  if (token) {
    const { valid, expired } = await verifyAccessToken(token);
    if (!valid || expired) return <NoAccess text="Link Expired" />;
    return <SharedFeedbacks params={{pageId:"1",projectId:params.projectId}}/>
  }

  const user = await getUser();
  if (!user) return <AccessRequest />;

  const isAccessible = await checkAccess({
    document_id: params.projectId,
    user_id: user.email,
  });

  if (!isAccessible) return <NoAccess />;

  return <div>{children}</div>;
}

function AccessRequest() {
  return (
    <div className="w-full min-h-[100vh] flex flex-col justify-center items-center">
      <p>You are not logged in</p>
      <AuthDialog buttonText="SignIn To Access" />
    </div>
  );
}
