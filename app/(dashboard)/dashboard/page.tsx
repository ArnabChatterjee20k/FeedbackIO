import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/server/utils";
import Banner from "./components/banner";
import Card from "@/components/card";
import { getSpaces } from "@/lib/server/db/spaces";
import Empty from "../../../components/empty";
import { PlusIcon } from "lucide-react";
import SpaceModal from "../../(workspace)/space/[projectId]/settings/components/create-space-modal";

export default async function page() {
  const user = await getUser();
  const userId = user?.$id as string;
  const spaces = await getSpaces(userId);

  return (
    <div>
      <section className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Banner />
        </div>
      </section>
      <section className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
          <div className="flex justify-between w-full items-center">
            <h2 className="text-4xl font-extrabold">Spaces</h2>
            <SpaceModal>
              <Button className="flex gap-1 items-center">
                <PlusIcon size={18} />
                Create a new space
              </Button>
            </SpaceModal>
          </div>
          <div className="mt-4 grid-cols-3 md:grid md:gap-4 mx-auto">
            {spaces?.length ? (
              spaces.map((space) => (
                <Card
                  logo={space.logo}
                  key={space.$id}
                  name={space.name}
                  feedbacks={12}
                  sentiment="POSITIVE"
                  spaceId = {space.$id}
                />
              ))
            ) : (
              <div className="col-span-3 mx-auto mt-7">
                <Empty text="No spaces yet" />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}