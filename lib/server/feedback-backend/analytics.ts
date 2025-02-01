// not using axios as fetch and get can be easily used for caching
import { FEEDBACK_BACKEND_URL, feedbackBackendDefaultHeader } from "./config";
import { generateURL } from "@/lib/utils";

const headers = feedbackBackendDefaultHeader;

function fetcher(url: string) {
  return fetch(url, { next: { revalidate: ONE_HOUR }, headers: headers });
}

const spaceTypesEndpointMap = {
  feedback: "feedback",
};

type SpaceType = keyof typeof spaceTypesEndpointMap;
type SpaceMetdata = {
  sentiment: number;
  total_feedback: number;
  landing_page_visit: number;
  wall_of_fame_visit: number;
};
type SpaceMetadataResponse = {
  success: boolean;
  data: SpaceMetdata;
};
const ONE_HOUR = 3600;

export async function getSpaceMetadata(
  spaceType: SpaceType,
  spaceId: string
): Promise<SpaceMetdata | null> {
  const endpoint = spaceTypesEndpointMap[spaceType];
  const url = `${FEEDBACK_BACKEND_URL}/analytics/${endpoint}/${spaceId}`;
  try {
    const res = await fetcher(url);
    if (!res.ok || res.status !== 200) throw new Error("Some Error Occured");
    const metadata: SpaceMetadataResponse = await res.json();
    if (!metadata.success) throw new Error("Some Error Occured");
    return metadata.data;
  } catch (error) {
    return null;
  }
}

type AnalyticsRecord = {
  success: boolean;
  metadata: {
    countries: Record<string, number>;
    browsers: Record<string, number>;
    os: Record<string, number>;
  };
};

export type VisitType = "landing page" | "wall of fame";
type VisitTypeResponse = AnalyticsRecord & {
  visits: Record<string, number>;
};

export async function getVisitData(
  spaceType: SpaceType,
  spaceId: string,
  visitType: VisitType,
  start?: string,
  end?: string
): Promise<VisitTypeResponse | null> {
  const endpoint = spaceTypesEndpointMap[spaceType];
  const url = generateURL(`${FEEDBACK_BACKEND_URL}/analytics/${endpoint}/${spaceId}`, {
    event: "visit",
    visit: visitType,
    ...(start ? { start } : {}),
    ...(end ? { end } : {}),
  });
  try {
    const res = await fetcher(url);
    if (!res.ok || res.status !== 200) throw new Error("Some Error Occured");
    const metadata: VisitTypeResponse = await res.json();
    if (!metadata.success) throw new Error("Some Error Occured");
    return metadata;
  } catch (error) {
    return null;
  }
}

type FeedbackSubmissionResponse = AnalyticsRecord & {
  feedbacks: Record<string, number>;
};

export async function getFeedbackSubmissionData(
  spaceType: SpaceType,
  spaceId: string,
  start?: string,
  end?: string
): Promise<FeedbackSubmissionResponse | null> {
  const endpoint = spaceTypesEndpointMap[spaceType];
  const url = generateURL(`${FEEDBACK_BACKEND_URL}/analytics/${endpoint}/${spaceId}`, {
    event: "submit",
    ...(start ? { start } : {}),
    ...(end ? { end } : {}),
  });
  try {
    const res = await fetcher(url);
    if (!res.ok || res.status !== 200) throw new Error("Some Error Occured");
    const metadata: FeedbackSubmissionResponse = await res.json();
    if (!metadata.success) throw new Error("Some Error Occured");
    return metadata;
  } catch (error) {
    return null;
  }
}
