export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/server/appwrite";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const secret = request.nextUrl.searchParams.get("secret");
  const next = request.nextUrl.searchParams.get("next") || "/";
  const error = request.nextUrl.searchParams.get("error");
  try {
    if (error) {
      console.error("OAuth Error:", error);
      return Response.redirect(`${next}?error=${encodeURIComponent(error)}`);
    }

    if (!userId || !secret) {
      console.error("Missing required parameters");
      return Response.redirect(`${next}?error=invalid_params`);
    }

    try {
      const { account } = await createAdminClient();
      const session = await account.createSession(userId, secret);
      // REMINDER for me: must be decoded in the receiver side
      const token = encodeURIComponent(session.secret);

      // Redirect with the session token
      return Response.redirect(`${next}?token=${token}`);
    } catch (sessionError) {
      console.error("Session creation error:", sessionError);
      return Response.redirect(`${next}?error=session_creation_failed`);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return Response.redirect(`${next}?error=unexpected_error`);
  }
}
