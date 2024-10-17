import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import FeedbackForm from "../../../../../components/feedback-form";
import ThankYouPage from "../../../../../components/thankyou-page";
import { Button } from "@/components/ui/button";
import { useProjectContext } from "../context/ProjectContextProvider";
import { Controller } from "react-hook-form";
import LandingPage from "@/components/landing-page";
import { SpaceFormType } from "../schema";
import LandingPageForm from "./landing-page-form";
import SettingsForm from "./settings-form";

interface Props {
  mode: "edit" | "new";
  data?: Record<string, string>;
}

type TabName = "LandingPage" | "ThankYou" | "Settings" | "Notifications";

export default function Space({ mode, data }: Props) {
  const {
    methods: { register, handleSubmit, watch, formState, control },
    spaceState,
    setSpaceState,
  } = useProjectContext();
  const [activeTab, setActiveTab] = useState<TabName>("LandingPage");

  const tabContent: Record<TabName, React.ReactNode> = {
    LandingPage: (
      <LandingPage
        {...spaceState.landingPageSchema}
        feedbackFormProps={{ ...spaceState.settingsSchema }}
      />
    ),
    Settings: (
      <FeedbackForm
        {...spaceState.settingsSchema}
        spaceDetails={{ ...spaceState.landingPageSchema }}
      />
    ),
    ThankYou: <ThankYouPage />,
    Notifications: (
      <FeedbackForm
        {...spaceState.settingsSchema}
        spaceDetails={{ ...spaceState.landingPageSchema }}
      />
    ),
  };

  const forms: Record<TabName, React.ReactNode> = {
    LandingPage: <LandingPageForm />,
    Settings: <SettingsForm />,
    ThankYou: <SettingsForm />,
    Notifications: <SettingsForm />,
  };

  const onSubmit = (data: any) => {
    console.log("Form Submitted:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-x-hidden flex flex-col md:flex-row gap-8 p-5 justify-between max-w-[1800px] mx-auto w-full"
    >
      <div className="w-full md:w-1/3">
        <div className="p-4 shadow-sm aspect-[3/4] overflow-scroll md:overflow-hidden">
          {tabContent[activeTab]}
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabName)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            {(Object.keys(tabContent) as TabName[]).map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4">
            {(Object.entries(tabContent) as [TabName, React.ReactNode][]).map(
              ([tab, content]) => (
                <TabsContent key={tab} value={tab}>
                  <Card className="p-4 rounded-sm shadow-sm">{forms[tab]}</Card>
                </TabsContent>
              )
            )}
          </div>
        </Tabs>

        <Button
          type="submit"
          className="my-2 rounded-sm w-full md:w-auto md:ml-[50%] md:mr-[50%]"
        >
          Create Space
        </Button>
      </div>
    </form>
  );
}
