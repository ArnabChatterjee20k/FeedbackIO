"use client";
import React, { useRef, useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import FeedbackForm from "../../../../../../components/feedback-form";
import ThankYouPage from "../../../../../../components/thankyou-page";
import { Button } from "@/components/ui/button";
import { useProjectContext } from "../context/ProjectContextProvider";
import { Controller } from "react-hook-form";
import LandingPage from "@/components/landing-page";
import { SpaceFormType } from "../schema";
import LandingPageForm from "./landing-page-form";
import SettingsForm from "./settings-form";
import ThankYouForm from "./thankyou-form";
import NotificationForm from "./notification-form";
import createSpaceAction, {
  SpaceFormState,
} from "../actions/edit-space.action";
import { useFormState } from "react-dom";
import { z } from "zod";
import { toast } from "sonner";

type TabName = "LandingPage" | "ThankYou" | "Settings" | "Notifications";
interface Props {
  spaceId:string
}

export default function Space({ spaceId }: Props) {
  const {
    methods: { handleSubmit },
    spaceState,
    getChangedData,
  } = useProjectContext();
  const [activeTab, setActiveTab] = useState<TabName>("LandingPage");
  const tabContent: Record<TabName, React.ReactNode> = {
    LandingPage: (
      <LandingPage
        {...spaceState.landingPageSchema}
        feedbackFormProps={{ ...spaceState.settingsSchema }}
        spaceId={spaceId}
      />
    ),
    Settings: (
      <FeedbackForm
        {...spaceState.settingsSchema}
        spaceDetails={{ ...spaceState.landingPageSchema }}
        spaceId={spaceId}
      />
    ),
    ThankYou: <ThankYouPage {...spaceState.thankYouPageSchema} />,
    Notifications: (
      <FeedbackForm
        {...spaceState.settingsSchema}
        spaceDetails={{ ...spaceState.landingPageSchema }}
        spaceId={spaceId}
      />
    ),
  };
  const [isTransition, startTransition] = useTransition();

  const forms: Record<TabName, React.ReactNode> = {
    LandingPage: <LandingPageForm />,
    Settings: <SettingsForm />,
    ThankYou: <ThankYouForm />,
    Notifications: <NotificationForm />,
  };

  /**
   * we cant use formState as react-hook-form does not compatible
   * if we want use it then we have call submit manually using a ref inside the handleSubmit
   * but it will only submit the current step form data and not all the forms
   * passing the logo separately in form of formdata as File is not serialisable through the actions
   */
  const onSubmit = handleSubmit(
    (data) => {
      startTransition(async () => {
        const logo = data["landingPageSchema"]?.logo;
        const formData = new FormData();
        if (logo && logo instanceof File) {
          // if its a file that means its been changed
          // and removing the the logo from the schema
          formData.set("logo", logo);
          data["landingPageSchema"].logo = "";
        }
        const changedData = getChangedData(data);
        const { message, success, errors } = await createSpaceAction(
          // @ts-ignore
          changedData,
          formData,
          spaceId
        );
        if (!success) {
          Object.entries(errors || {}).forEach(([key, errorsSend]) => {
            errorsSend.forEach((error) => {
              toast.error(`Error occured in ${key}`, {
                description: error,
                duration: 10000,
              });
            });
          });
        }
      });
    },
    (invalid) => {
      toast.error("Check the tabs, some error happened");
    }
  );
  return (
    <form
      onSubmit={onSubmit}
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
          {isTransition ? "Loading..." : "Create Space"}
        </Button>
      </div>
    </form>
  );
}
