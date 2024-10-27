import { createJWT, verifyJWT } from "@/lib/server/tokens/get-token";
import { cookies } from "next/headers";

export async function getFeedbackCookie() {
  const token = (await cookies()).get("feedback-so-token")?.value;
  if (token) {
    const jwt = await verifyJWT(token);
    if (jwt["feedback-status"] === "200") return token;
  }
  return "";
}

export async function setFeedbackCookie() {
  const jwt = await createJWT({ "feedback-status": "200" });
  const token = (await cookies()).set("feedback-so-token", jwt, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milisecond
  });

  return token;
}
