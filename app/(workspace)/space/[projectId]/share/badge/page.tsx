import BadgeCard from "../components/badge-card";

export default function page({
  params,
}: {
  params: { projectId: string };
}) {
  const siteUrl = process.env.NEXT_SITE_URL || "";
  // Serve the badge image through a CDN when configured, otherwise the app itself.
  const badgeBase = process.env.NEXT_PUBLIC_BADGE_CDN_URL || siteUrl;

  return (
    <section className="flex min-h-screen items-center justify-center p-6">
      <BadgeCard
        badgeBase={badgeBase}
        siteUrl={siteUrl}
        projectId={params.projectId}
      />
    </section>
  );
}
