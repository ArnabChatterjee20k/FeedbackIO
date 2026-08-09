"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BADGE_ICONS,
  BADGE_ICON_KEYS,
  DEFAULT_ICON,
  type BadgeIconKey,
} from "@/lib/badge/icons";

// Must match the defaults/limit in app/api/badge/[projectId]/route.ts.
const DEFAULT_LABEL = "feedback";
const DEFAULT_CTA = "give feedback";
const MAX_TEXT_LEN = 40;

// Renders a lucide icon from its shared node data (the same data the server uses
// to draw the badge) so the picker never drifts from the registry.
function IconGlyph({
  name,
  className,
}: {
  name: BadgeIconKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {BADGE_ICONS[name].map(([Tag, attrs], i) => {
        const Element = Tag as keyof JSX.IntrinsicElements;
        return <Element key={i} {...(attrs as any)} />;
      })}
    </svg>
  );
}

export default function BadgeCard({
  badgeBase,
  siteUrl,
  projectId,
}: {
  // Host that serves the badge image (CDN when configured, else the app).
  badgeBase: string;
  // App host used for the click-through link to the public feedback page.
  siteUrl: string;
  projectId: string;
}) {
  const [showCount, setShowCount] = useState(false);
  const [dark, setDark] = useState(false);
  const [icon, setIcon] = useState<BadgeIconKey>(DEFAULT_ICON);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const [ctaText, setCtaText] = useState(DEFAULT_CTA);

  const imgUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (showCount) params.set("count", "true");
    if (icon !== DEFAULT_ICON) params.set("icon", icon);
    if (dark) params.set("theme", "dark");
    const trimmedLabel = label.trim();
    const trimmedCta = ctaText.trim();
    if (trimmedLabel && trimmedLabel !== DEFAULT_LABEL)
      params.set("label", trimmedLabel);
    if (trimmedCta && trimmedCta !== DEFAULT_CTA) params.set("text", trimmedCta);
    const qs = params.toString();
    return `${badgeBase}/api/badge/${projectId}${qs ? `?${qs}` : ""}`;
  }, [badgeBase, projectId, showCount, icon, dark, label, ctaText]);

  const target = `${siteUrl}/${projectId}/landing-page`;
  const markdown = `[![Give feedback with FeedbackIO](${imgUrl})](${target})`;
  const html = `<a href="${target}"><img src="${imgUrl}" alt="Give feedback with FeedbackIO" /></a>`;

  const copy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <Card className="flex flex-col gap-6 p-6 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold">GitHub Badge</h2>
        <p className="text-sm text-muted-foreground">
          Add this badge to your repo README or profile. Visitors who click it
          land on your public feedback page.
        </p>
      </div>

      {/* Live preview */}
      <div className="flex items-center gap-3 min-h-[24px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgUrl} alt="Give feedback with FeedbackIO" height={20} />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Custom text */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="badge-label">Label</Label>
            <Input
              id="badge-label"
              value={label}
              maxLength={MAX_TEXT_LEN}
              placeholder={DEFAULT_LABEL}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="badge-cta">Call to action</Label>
            <Input
              id="badge-cta"
              value={ctaText}
              maxLength={MAX_TEXT_LEN}
              placeholder={DEFAULT_CTA}
              disabled={showCount}
              onChange={(e) => setCtaText(e.target.value)}
            />
            {showCount && (
              <p className="text-xs text-muted-foreground">
                Replaced by the live count.
              </p>
            )}
          </div>
        </div>

        {/* Icon picker */}
        <div className="flex items-center justify-between">
          <Label>Icon</Label>
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <IconGlyph name={icon} className="h-4 w-4" />
                <span className="capitalize">{icon.replace(/-/g, " ")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="grid grid-cols-6 gap-1 max-h-56 overflow-y-auto">
                {BADGE_ICON_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    title={key.replace(/-/g, " ")}
                    onClick={() => {
                      setIcon(key);
                      setPickerOpen(false);
                    }}
                    className={`flex items-center justify-center rounded-md p-2 hover:bg-accent ${
                      icon === key ? "bg-accent ring-1 ring-primary" : ""
                    }`}
                  >
                    <IconGlyph name={key} className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Dark theme */}
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-theme">Dark theme</Label>
          <Switch id="dark-theme" checked={dark} onCheckedChange={setDark} />
        </div>

        {/* Live count */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-count">Show live feedback count</Label>
          <Switch
            id="show-count"
            checked={showCount}
            onCheckedChange={setShowCount}
          />
        </div>
      </div>

      {/* Markdown snippet */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Markdown</Label>
          <Button variant="outline" size="sm" onClick={() => copy(markdown)}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>
        <Textarea value={markdown} readOnly rows={2} className="font-mono text-xs" />
      </div>

      {/* HTML snippet */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>HTML</Label>
          <Button variant="outline" size="sm" onClick={() => copy(html)}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>
        <Textarea value={html} readOnly rows={2} className="font-mono text-xs" />
      </div>
    </Card>
  );
}
