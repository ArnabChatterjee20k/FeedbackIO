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
import { usePathname } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Feedbacks",
      url: "feedbacks",
      icon: MessageSquareHeart,
      isActive: true,
      items: [
        {
          title: "All",
          url: "all",
        },
        {
          title: "Liked",
          url: "liked",
        },
      ],
    },
    {
      title: "Integrations",
      url: "integrations",
      icon: Workflow,
      items: [
        {
          title: "Twitter",
          url: "twitter",
        },
        {
          title: "Linkedin",
          url: "linkedin",
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
      url: "embed",
      icon: Globe,
      items: [
        {
          title: "Wall of love",
          url: "wall-of-love",
        },
        {
          title: "Feeback widget",
          url: "feedback-widget",
        },
      ],
    },
  ],
  "Quick Links": [
    {
      name: "Landing Page",
      url: "share/landing-page",
      icon: Frame,
    },
    {
      name: "Wall of fame",
      url: "share/wall-of-love",
      icon: PieChart,
    },
  ],
};

export function AppSidebar({
  children,
  user,
  space,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User; space: Space }) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = React.useState<
    { title: string; url: string }[]
  >([]);
  React.useEffect(() => {
    const updateBreadcrumbs = () => {
      // first two segments will be dashboard/id
      // turning the id to the space name
      const paths = pathname.split("/").filter(Boolean);
      paths[1] = space.name
      let currentPath = "";
      const newBreadcrumbs = paths.map((path) => {
        currentPath += `/${path}`;
        const navItem = data.navMain.find((item) => item.url === path);
        return {
          title: navItem?.title || path,
          url: currentPath,
        };
      });
      setBreadcrumbs(newBreadcrumbs);
    };

    updateBreadcrumbs();
  }, [pathname]);
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={[space]} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavProjects projects={data["Quick Links"]} />
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
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.url}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink>
                          {crumb.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
