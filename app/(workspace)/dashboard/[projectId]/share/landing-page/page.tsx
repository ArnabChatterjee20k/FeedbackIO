import { getUserSettingsStatus } from "@/app/(user)/[projectId]/landing-page/utils";
import LandingPage, { FeedbackFormProps } from "@/components/landing-page";
import getLandingPage from "@/lib/server/db/landing-page";
import { notFound } from "next/navigation";
import ShareButtons from "../../components/share-buttons";
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
    <section className="flex flex-col">
      <div className="self-end mr-16">
        <ShareButtons
          url={`${process.env.NEXT_SITE_URL}/${params.projectId}/landing-page`}
          text="Share Landing Page"
        />
      </div>
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
    </section>
  );
}
