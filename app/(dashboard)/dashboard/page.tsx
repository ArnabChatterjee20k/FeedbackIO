import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/server/oauth";
import { getUser } from "@/lib/server/utils";
import { redirect } from "next/navigation";
import Signout from "./Signout";

export default async function page() {
  const user = await getUser();

  return (
    <div>
      {user?.name}
      <Signout/>
    </div>
  );
}
