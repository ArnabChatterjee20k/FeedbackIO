// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./lib/server/utils";
const corsOptions = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
export async function middleware(req: NextRequest) {
  // preflighted requests
  if(req.method==="OPTIONS"){
    return NextResponse.json({},{headers:corsOptions})
  }
  const user = await getUser();
  const isDashboardRequest = req.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRequest = req.nextUrl.pathname.startsWith("/login");
  const isShareRequest = req.nextUrl.pathname.match(new RegExp("^/[^/]+/share(/.*)?$"))

  if (isDashboardRequest && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isLoginRequest && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // hack: searchParams not accessible in the /projectId/share/ -> so sending the route url with it
  if(isShareRequest){
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-url', req.url);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login","/api/:path*","/:projectId/share/:path*"] // Only apply this middleware to the /dashboard route
};
