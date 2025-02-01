// app/analytics.tsx
'use client';

import { Suspense } from "react";
import { SpaceEventAnalytics } from "./space-event-analytics";
import Loader from "./loader";
import { MainChart } from "./components/main-chart";
import { MetadataChart } from "./components/metadata-chart";
import { visitType } from "../types/analytics";

export default function Analytics({
  spaceId,
  event,
  visit,
}: {
  spaceId: string;
  event: 'submit' | 'visit';
  visit?: visitType;
}) {
  return (
    <Suspense fallback={<Loader />}>
      <section className="flex flex-col max-w-[1400px] w-full mx-auto gap-5">
        <MainChart spaceId={spaceId} eventType={event} visitType={visit} />
        <div className="flex flex-col sm:flex-row w-full gap-8">
          <SpaceEventAnalytics 
            spaceId={spaceId} 
            event={event} 
            visit={visit}
          />
          
          <MetadataChart 
            spaceId={spaceId} 
            eventType={event} 
            visitType={visit} 
          />
        </div>
      </section>
    </Suspense>
  );
}