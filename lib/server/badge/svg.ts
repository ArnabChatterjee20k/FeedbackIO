// Renders a small shields-style "flat" badge as an SVG string.
// Two segments: a themed left label and a brand-colored right message, with a
// selectable outline icon on the left. Everything is inlined so the SVG is
// self-contained and CDN/README friendly.

import {
  BADGE_ICONS,
  DEFAULT_ICON,
  renderIcon,
  type BadgeIconKey,
} from "@/lib/badge/icons";

export type BadgeTheme = "light" | "dark";

const BRAND_COLOR = "#ea580c"; // orange-600, matches app branding

// Per-theme palette. The message (right) segment stays brand-colored in both;
// the label (left) segment and text adapt so the badge reads well on light and
// dark README backgrounds.
const THEMES: Record<
  BadgeTheme,
  { labelBg: string; labelText: string; messageText: string }
> = {
  light: { labelBg: "#404040", labelText: "#ffffff", messageText: "#ffffff" },
  // #21262d = GitHub dark "elevated surface": visible as a chip on the #0d1117
  // README canvas without washing out.
  dark: { labelBg: "#21262d", labelText: "#e6edf3", messageText: "#ffffff" },
};

const FONT = "Verdana,DejaVu Sans,Geneva,sans-serif";
const FONT_SIZE = 11;
const HEIGHT = 20;
const PAD = 6; // horizontal padding inside each segment
const ICON_SIZE = 11;
const ICON_GAP = 3;
const LOGO_W = ICON_SIZE + ICON_GAP; // space reserved for the icon + gap

// Rough average glyph width for 11px Verdana. Good enough to avoid clipping;
// badges don't need pixel-perfect text metrics.
function textWidth(text: string): number {
  return Math.ceil(text.length * 6.5);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface BadgeOptions {
  label: string;
  message: string;
  icon?: BadgeIconKey;
  theme?: BadgeTheme;
}

export function renderBadge({
  label,
  message,
  icon = DEFAULT_ICON,
  theme = "light",
}: BadgeOptions): string {
  const safeLabel = escapeXml(label);
  const safeMessage = escapeXml(message);
  const palette = THEMES[theme] ?? THEMES.light;
  const iconKey: BadgeIconKey = BADGE_ICONS[icon] ? icon : DEFAULT_ICON;

  const leftW = PAD + LOGO_W + textWidth(label) + PAD;
  const rightW = PAD + textWidth(message) + PAD;
  const totalW = leftW + rightW;

  const labelTextX = PAD + LOGO_W;
  const messageTextX = leftW + PAD;
  const textY = 14; // baseline

  // Icon: scale a 24x24 lucide viewBox down to ICON_SIZE, vertically centered.
  const iconScale = ICON_SIZE / 24;
  const iconY = (HEIGHT - ICON_SIZE) / 2;
  const iconMarkup = `<g transform="translate(${PAD},${iconY}) scale(${iconScale})">${renderIcon(
    iconKey,
    palette.labelText
  )}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${HEIGHT}" role="img" aria-label="${safeLabel}: ${safeMessage}">
  <title>${safeLabel}: ${safeMessage}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${totalW}" height="${HEIGHT}" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftW}" height="${HEIGHT}" fill="${palette.labelBg}"/>
    <rect x="${leftW}" width="${rightW}" height="${HEIGHT}" fill="${BRAND_COLOR}"/>
    <rect width="${totalW}" height="${HEIGHT}" fill="url(#s)"/>
  </g>
  ${iconMarkup}
  <g text-anchor="start" font-family="${FONT}" font-size="${FONT_SIZE}">
    <text x="${labelTextX}" y="${textY + 0.5}" fill="#000" fill-opacity=".3">${safeLabel}</text>
    <text x="${labelTextX}" y="${textY}" fill="${palette.labelText}">${safeLabel}</text>
    <text x="${messageTextX}" y="${textY + 0.5}" fill="#000" fill-opacity=".3">${safeMessage}</text>
    <text x="${messageTextX}" y="${textY}" fill="${palette.messageText}">${safeMessage}</text>
  </g>
</svg>`;
}
