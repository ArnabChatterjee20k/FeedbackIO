import React from "react";
import Banner from "../components/banner";
import { VideoBannerInterface } from "../components/banner";
import { Button } from "@/components/ui/button";
import SpaceModal from "@/app/(workspace)/space/[projectId]/settings/components/create-space-modal";
import { FormInputIcon, PlusIcon } from "lucide-react";
import Empty from "@/components/empty";
import Card from "@/components/card";

const bannerInfo: VideoBannerInterface = {
  url: "#",
  mainText: "Have 5 mins?",
  demoText: "Here's a quick demo 👉",
  description:
    "The demo includes an end-to-end demonstration of creating custom forms.",
};
export default function page() {
  return (
    <div>
      <section className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Banner {...bannerInfo} />
        </div>
      </section>
      <section className="py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
          <div className="flex justify-between w-full items-center">
            <h2 className="text-4xl font-extrabold">Forms</h2>
            <SpaceModal>
              <Button className="flex gap-1 items-center">
                <PlusIcon size={18} />
                Create a new form
              </Button>
            </SpaceModal>
          </div>
          <div className="mt-4 grid-cols-3 md:grid md:gap-4 mx-auto">
            <>
              {[1,2,3]?.length ? (
                [1,2,3,4].map((space) => (
                  <Card
                    key={1}
                    name={"arnab"}
                    icon={FormInputIcon}
                    url={`/space/settings`}
                  />
                ))
              ) : (
                <div className="col-span-3 mx-auto mt-7">
                  <Empty text="No spaces yet" />
                </div>
              )}
            </>
          </div>
        </div>
      </section>
    </div>
  );
}
