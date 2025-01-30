import { redirect } from "next/navigation";
import Analytics from "./analytics";
import { visitType, type eventType } from "../types/analytics";
export default function Page({
  params: { projectId },
  searchParams: { event, visit },
}: {
  params: { projectId: string };
  searchParams: { event: eventType; visit?: visitType };
}) {
  if (!event || (event != "submit" && event != "visit"))
    redirect("?event=submit");
  if (event === "visit" && visit !== "landing-page" && visit !== "wall-of-fame")
    redirect("?event=visit&visit=landing-page");
  return <Analytics spaceId={projectId} event={event} visit={visit}/>;
}
