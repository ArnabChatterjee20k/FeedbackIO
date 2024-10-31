import WallOfFame from "./wall-of-fame";

import React from 'react'

export default function page({
    params,
  }: {
    params: { projectId: string };
  }) {
  return <WallOfFame params={{projectId:params.projectId}}/>
}
