import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  const { account } = await createAdminClient();
  const session = await account.createSession(userId!, secret!);
  // needs to be awaited otherwise not working
  (await cookies()).set(process.env.NEXT_SESSION_COOKIE!, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });
  const response = NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
  return response;
}
