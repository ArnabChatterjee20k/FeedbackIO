"use client";

import * as React from "react";
import {
  NotebookText,
  ChartColumnBig,
  ChartNoAxesColumn
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { type User } from "../types/navTypes";
import { Separator } from "@/components/ui/separator";
import GraidentAvatar from "@/components/graident-avatar";

const data = {
  navMain: [
    {
      title: "Spaces",
      url: "",
      icon: NotebookText,
      isActive: true,
    },
    {
      title: "Polls",
      url: "polls",
      icon: ChartColumnBig,
      isActive: true,
    },
    {
      title: "Analytics",
      url: "analytics",
      icon: ChartNoAxesColumn,
      isActive: true,
    },
  ],
};

export function AppSidebar({
  children,
  user,
  mainUrl,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User , mainUrl:string}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <NavMain items={data.navMain} mainUrl={mainUrl}/>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              avatar: <GraidentAvatar id={user.email} />,
              email: user?.email,
              name: user?.name,
            }}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
