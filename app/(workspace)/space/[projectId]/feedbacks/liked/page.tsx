import Empty from "@/components/empty";
import { getAllWallOfFameFeedbacks } from "@/lib/server/db/feedback";
import React from "react";
import { Feedbackcard } from "../../components/feedback-card";

export default async function page({
  params,
}: {
  params: { projectId: string };
}) {
  const spaceId = params.projectId;
  const data = await getAllWallOfFameFeedbacks(spaceId);
  if (!data) return <h2>Some error occured</h2>;
  if (!data.length)
    return (
      <Empty>You haven't marked any of your feedback to wall of fame</Empty>
    );
  return (
    <section className="columns-1 sm:columns-2 md:columns-3 lg:columns-4">
      {data.map(({ feedback, stars, userEmail, name, $id, wall_of_fame }) => {
        return (
          <div className="mb-2">
            <Feedbackcard
              wallOfFame={wall_of_fame}
              id={$id}
              email={userEmail}
              feedback={feedback}
              stars={stars}
              name={name}
            />
          </div>
        );
      })}
    </section>
  );
}
