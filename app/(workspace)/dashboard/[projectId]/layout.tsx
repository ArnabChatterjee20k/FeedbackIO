"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/app/(workspace)/dashboard/[projectId]/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <AppSidebar>{children}</AppSidebar>;
}
