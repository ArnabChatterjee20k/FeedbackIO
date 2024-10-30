import React from "react";
import { Feedbackcard } from "../../../components/feedback-card";
import PaginatedView from "../../component/paginated-view";
import { getAllFeedbacks } from "@/lib/server/db/feedback";

export default async function page({params}:{params:{pageId:string,projectId:string}}) {
  try {
    const feedbacks = await getAllFeedbacks({space_id:params.projectId,page:parseInt(params.pageId || "1")})
    return (
      <PaginatedView isNext = {feedbacks.isNext} baseLink={`dashboard/${params.projectId}/feedbacks/all`}>
        <section className="grid grid-cols-4 gap-3">
          {feedbacks.documents.map(({feedback,stars,userEmail,name})=>{
            return <Feedbackcard email={userEmail} feedback={feedback} stars={stars} name={name}/>
          })}
        </section>
      </PaginatedView>
    );
  } catch (error) {
    return <h1>Some error occured</h1>
  }
}
