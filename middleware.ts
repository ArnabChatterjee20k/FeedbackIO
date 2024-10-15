// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./lib/server/utils";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const user = await getUser();
  const isDashboardRequest = req.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRequest = req.nextUrl.pathname.startsWith("/login");

  if (isDashboardRequest && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoginRequest && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login"], // Only apply this middleware to the /dashboard route
};
