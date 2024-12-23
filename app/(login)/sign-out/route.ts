import { redirect } from "next/navigation";
import {signOut} from "@/lib/server/appwrite"
export async function GET() {
    await signOut()
    return redirect("/")
  }  