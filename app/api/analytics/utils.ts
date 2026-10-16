import { getSpace } from "@/lib/server/db/spaces";
import { getUser } from "@/lib/server/utils";
import { NextResponse } from "next/server";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Validates the common query params and that the signed-in user owns the space.
export async function parseAnalyticsRequest(
  searchParams: URLSearchParams
): Promise<
  | { spaceId: string; start: string; end: string; error?: undefined }
  | { error: NextResponse }
> {
  const spaceId = searchParams.get("spaceId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  if (!spaceId || !start || !end || !DATE.test(start) || !DATE.test(end) || start > end) {
    return {
      error: NextResponse.json({ error: "Missing or invalid parameters" }, { status: 400 }),
    };
  }
  const user = await getUser();
  if (!user || !(await getSpace(user.$id, spaceId))) {
    return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  }
  return { spaceId, start, end };
}
