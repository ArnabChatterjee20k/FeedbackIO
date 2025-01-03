import WallOfFame from "@/app/(user)/[projectId]/wall-of-fame/wall-of-fame";
import ShareButtons from "../../components/share-buttons";
import { DownloadAsImageButton } from "@/components/download-as-image-button";
export default function page({ params }: { params: { projectId: string } }) {
  return (
    <section className="flex flex-col">
      <div className="self-end mr-16">
        <ShareButtons
          downloadImageSectionId={"wall-of-fame"}
          url={`${process.env.NEXT_SITE_URL}/${params.projectId}/wall-of-fame`}
          text="Share Wall of Fame"
        />
      </div>
      <WallOfFame params={{ projectId: params.projectId }} />
    </section>
  );
}
