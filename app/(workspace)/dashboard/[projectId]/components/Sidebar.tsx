"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  MessageSquareHeart,
  Workflow,
  Globe,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../../../components/ui/breadcrumb";
import { Separator } from "../../../../../components/ui/separator";
import { Space, User } from "../types/navTypes";
import GraidentAvatar from "@/components/graident-avatar";
import { useParams } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Feedbacks",
      url: "#",
      icon: MessageSquareHeart,
      isActive: true,
      items: [
        {
          title: "Liked",
          url: "#",
        },
        {
          title: "Social Media",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Integrations",
      url: "#",
      icon: Workflow,
      items: [
        {
          title: "Twitter",
          url: "#",
        },
        {
          title: "Linkedin",
          url: "#",
        },
        {
          title: "Add more",
          url: "#",
        },
      ],
    },
    {
      title: "Edit Space",
      url: "settings",
      icon: Settings2,
    },
    {
      title: "Embed",
      url: "#",
      icon: Globe,
      items: [
        {
          title: "Wall of love",
          url: "#",
        },
        {
          title: "Feeback widget",
          url: "#",
        },
      ],
    },
  ],
  preview: [
    {
      name: "Landing Page",
      url: "#",
      icon: Frame,
    },
    {
      name: "Wall of fame",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Thank you page",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  children,
  user,
  space,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User; space: Space }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={[space]} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data.preview} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              avatar: <GraidentAvatar id={user.email} />,
              email: user.email,
              name: user.name,
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
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
