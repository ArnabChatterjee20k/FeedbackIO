import { runs } from "@trigger.dev/sdk/v3";

async function getFailedRuns() {
  const failedRuns = await runs.list({
    status: "FAILED",
  });
  for(const run of failedRuns.data){
    console.log({
        metadata:run.metadata,
        id:run.id,
        createdAt:run.createdAt,
    })
  }
}

getFailedRuns()