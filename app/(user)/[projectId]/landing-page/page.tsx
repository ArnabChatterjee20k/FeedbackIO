import LandingPage, { FeedbackFormProps } from "@/components/landing-page";
import getLandingPage from "@/lib/server/db/landing-page";
import { getSettings } from "@/lib/server/db/settings";
import { notFound } from "next/navigation";
import { getUserSettingsStatus } from "./utils";

export default async function page({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;
  await getUserSettingsStatus(projectId);

  const [landingPage, settings] = await Promise.all([
    getLandingPage(projectId),
    getUserSettingsStatus(projectId),
  ]);

  const {
    docs: landingPageDocs,
    status: landingPageStatus,
    message: landingPageResponseMessage,
  } = landingPage;
  if (landingPageStatus === 404) return notFound();
  else if (!landingPageDocs || landingPageStatus === 500)
    return <h2>{landingPageResponseMessage}</h2>;
  const {
    name,
    buttonText,
    logo,
    message,
    primaryColor,
    questionSection,
    questions,
  } = landingPageDocs;
  const {
    status,
    settings: settingsDocs,
    type,
    message: feedbackStatus,
    success,
  } = settings;

  return (
    <LandingPage
      name={name as string}
      buttonText={buttonText as string}
      logo={logo as string}
      message={message as string as string}
      primaryColor={primaryColor as string}
      questionSection={questionSection as boolean}
      questions={questions as string[]}
      feedbackFormProps={settingsDocs as FeedbackFormProps}
      spaceId={projectId}
      sharingEnvironment={{ success: success, type: type ? type : null }}
    />
  );
}
