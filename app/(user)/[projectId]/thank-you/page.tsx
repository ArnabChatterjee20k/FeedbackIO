import ThankYouPage from "@/components/thankyou-page";
import getThankYou from "@/lib/server/db/thank-you";
import { notFound } from "next/navigation";

export default async function page({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = params.projectId;

  const {
    docs: thankYouPageDocs,
    status: thankyouPageStatus,
    message: thankyouPageResponseMessage,
  } = await getThankYou(projectId);
  if (thankyouPageStatus === 404) return notFound();
  else if (!thankYouPageDocs || thankyouPageStatus === 500)
    return <h2>{thankyouPageResponseMessage}</h2>;

  const { message, title } = thankYouPageDocs;
  return <ThankYouPage message={message} title={title} />;
}
