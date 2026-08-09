import { NextRequest } from "next/server";
import { unstable_cache } from "next/cache";
import { getFeedbackCount } from "@/lib/server/db/feedback";
import { renderBadge, type BadgeTheme } from "@/lib/server/badge/svg";
import { DEFAULT_ICON, isValidIcon } from "@/lib/badge/icons";

// Node runtime (default) is required: getFeedbackCount uses the node-appwrite
// admin client. Do not switch to the edge runtime.

const LABEL = "feedback";
const CTA_MESSAGE = "give feedback";
const ONE_HOUR = 3600;
const MAX_TEXT_LEN = 40;

// Matches ASCII control characters (0x00-0x1F and 0x7F).
const CONTROL_CHARS = new RegExp("[\u0000-\u001F\u007F]", "g");

// Sanitizes user-supplied badge text: drops control characters, trims, and caps
// length. Falls back to `fallback` when empty. XML escaping happens in the SVG
// renderer.
function sanitizeText(value: string | null, fallback: string): string {
  if (!value) return fallback;
  const cleaned = value.replace(CONTROL_CHARS, "").trim();
  if (!cleaned) return fallback;
  return cleaned.slice(0, MAX_TEXT_LEN);
}

// Next.js Data Cache layer: cache the count per project for 1 hour so repeated
// badge renders reuse the value without touching Appwrite. Combined with the
// HTTP cache below, this keeps DB load minimal.
const getCachedFeedbackCount = (projectId: string) =>
  unstable_cache(
    () => getFeedbackCount(projectId),
    ["badge-feedback-count", projectId],
    { revalidate: ONE_HOUR, tags: [`badge-count:${projectId}`] }
  )();

// Cache headers. The static CTA badge is identical for everyone, so it can be
// cached hard. The count badge uses a 1-hour HTTP cache to match the data caches.
const STATIC_CACHE =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800";
const COUNT_CACHE =
  "public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200";

function svgResponse(svg: string, cacheControl: string): Response {
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": cacheControl,
      // Allow embedding anywhere (GitHub camo, docs, etc.)
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const projectId = params.projectId;
  const searchParams = req.nextUrl.searchParams;
  const wantCount = searchParams.get("count") === "true";

  const iconParam = searchParams.get("icon");
  const icon = isValidIcon(iconParam) ? iconParam : DEFAULT_ICON;
  const theme: BadgeTheme =
    searchParams.get("theme") === "dark" ? "dark" : "light";

  // Custom text: `label` is the left segment; `text` is the right call-to-action
  // (ignored when a live count is shown, since the count takes that slot).
  const label = sanitizeText(searchParams.get("label"), LABEL);
  const ctaMessage = sanitizeText(searchParams.get("text"), CTA_MESSAGE);

  // Static CTA badge: no DB read, aggressively cacheable.
  if (!wantCount || !projectId) {
    return svgResponse(
      renderBadge({ label, message: ctaMessage, icon, theme }),
      STATIC_CACHE
    );
  }

  // Live count badge. On any failure, fall back to the CTA badge so a README
  // never renders a broken image or a 500.
  try {
    const count = await getCachedFeedbackCount(projectId);
    return svgResponse(
      renderBadge({ label, message: String(count), icon, theme }),
      COUNT_CACHE
    );
  } catch (error) {
    console.error("Badge count failed for", projectId, error);
    return svgResponse(
      renderBadge({ label, message: ctaMessage, icon, theme }),
      COUNT_CACHE
    );
  }
}
