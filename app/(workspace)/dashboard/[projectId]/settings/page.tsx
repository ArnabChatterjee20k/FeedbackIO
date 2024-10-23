// we cant use layout as a parent.
// so making it as client
// and rendering a server component inside it
import React from "react";
import Space from "./components/space";
import { ProjectContextProvider } from "./context/ProjectContextProvider";
import { getSpacePages } from "@/lib/server/db/spaces";
import { SpaceFormType } from "./schema";
export default async function page({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  const spaceData = await getSpacePages(projectId);
  if (!spaceData) return <h1>Some error occured while fetching settings</h1>;
  const {landingPageSchema,notificationSchema,settingsSchema,thankYouPageSchema} = spaceData
  const initialSpaceData = {landingPageSchema,notificationSchema,settingsSchema,thankYouPageSchema} as unknown as Partial<SpaceFormType>
  return (
    <ProjectContextProvider
      initialSpaceData={initialSpaceData}
    >
      <Space spaceId={projectId}/>
    </ProjectContextProvider>
  );
}
