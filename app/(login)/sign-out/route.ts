import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export function GET() {
    cookies().delete(process.env.NEXT_SESSION_COOKIE!);
    return redirect("/")
  }  