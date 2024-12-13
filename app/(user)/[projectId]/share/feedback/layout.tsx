import React, { PropsWithChildren } from "react";
import checkAccess from "../utils/checkAccess";
import { getUser } from "@/lib/server/utils";
import { redirect } from "next/navigation";
import AuthDialog from "@/components/auth-dialog";
import NoAccess from "../components/NoAccess";

interface LayoutProps{
  params:{projectId:string}
}

export default async function Layout({children,params}:PropsWithChildren & LayoutProps) {
  const user = await getUser();
  if (!user) return <AccessRequest />;
  const isAccessible = await checkAccess({
    document_id: params.projectId,
    user_id: user?.email as string,
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
