"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";

export default function Signout() {
  async function handleSignout() {
    await signOut();
    return redirect("/");
  }
  return (
    <form action={handleSignout}>
      <Button type="submit">logout</Button>
    </form>
  );
}
