import { Sidebar } from "@/components/ui/sidebar";
import { getUser } from "@/lib/server/utils";
import { type User } from "./types/navTypes";
import { AppSidebar } from "./components/Sidebar";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  // imported cookies to make it dynamic
  // otherwise builder is thinking it to be a static page and giving prerendering error
  cookies().get(process.env.NEXT_SESSION_COOKIE!)?.value
  const userDetails: User = {
    email: user?.email as string,
    name: user?.name as string,
  };
  return (
    <section className="flex flex-col min-h-screen">
      <AppSidebar mainUrl="/dashboard" user={userDetails}>{children}</AppSidebar>
    </section>
  );
}
