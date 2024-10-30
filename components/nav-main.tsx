"use client";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const params = useParams();
  const { projectId } = params;
  const pathname = usePathname();

  const isMainItemActive = (itemUrl: string) => {
    return (
      pathname === `/dashboard/${projectId}/${itemUrl}` ||
      pathname.startsWith(`/dashboard/${projectId}/${itemUrl}/`)
    );
  };

  const isSubItemActive = (mainItemUrl: string, subItemUrl: string) => {
    return pathname === `/dashboard/${projectId}/${mainItemUrl}/${subItemUrl}`;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const mainItemActive = isMainItemActive(item.url);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={mainItemActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  {item?.items?.length ? (
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={mainItemActive}
                    >
                      <>
                        {item.icon && (
                          <item.icon
                            className={mainItemActive ? "text-primary" : ""}
                          />
                        )}
                        <span className={mainItemActive ? "font-medium" : ""}>
                          {item.title}
                        </span>
                        <ChevronRight
                          className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${
                            mainItemActive ? "text-primary" : ""
                          }`}
                        />
                      </>
                    </SidebarMenuButton>
                  ) : (
                    <Link
                      href={`/dashboard/${projectId}/${item.url}`}
                      className="w-full"
                    >
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={mainItemActive}
                      >
                        <>
                          {item.icon && (
                            <item.icon
                              className={mainItemActive ? "text-primary" : ""}
                            />
                          )}
                          <span className={mainItemActive ? "font-medium" : ""}>
                            {item.title}
                          </span>
                        </>
                      </SidebarMenuButton>
                    </Link>
                  )}
                </CollapsibleTrigger>
                {item?.items?.length && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const subItemActive = isSubItemActive(
                          item.url,
                          subItem.url
                        );

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItemActive}
                            >
                              <Link
                                href={`/dashboard/${projectId}/${item.url}/${subItem.url}`}
                                className={`w-full ${
                                  subItemActive
                                    ? "text-primary font-medium"
                                    : ""
                                }`}
                              >
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
