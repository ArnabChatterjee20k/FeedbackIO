import { createAdminClient } from "@/lib/server/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");

  const { account } = await createAdminClient();
  const session = await account.createSession(userId!, secret!);
  cookies().set(process.env.NEXT_SESSION_COOKIE!, session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
}