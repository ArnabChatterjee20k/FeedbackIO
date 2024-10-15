import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/server/oauth";
import { getUser } from "@/lib/server/utils";
import { redirect } from "next/navigation";
import Signout from "./Signout";
import Banner from "./components/banner";

export default async function page() {
  const user = await getUser();

  return (
    <div>
      <section className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Banner />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
      </section>
    </div>
  );
}
