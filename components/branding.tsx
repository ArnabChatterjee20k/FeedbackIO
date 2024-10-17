import Link from "next/link";
export default function Branding() {
  return (
    <span className="text-sm">
      Powered by{" "}
      <Link
        href={process.env.NEXT_SITE_URL! || ""}
        className="font-bold text-orange-600 underline"
      >
        FeedbackSo
      </Link>
    </span>
  );
}
