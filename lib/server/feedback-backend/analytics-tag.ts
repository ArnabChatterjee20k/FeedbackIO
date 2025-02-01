import { VisitType } from "./analytics";

export function getFeedbackKey(userIP: string, spaceID: string) {
  return `analytics:feedback:submit:${spaceID}:${userIP}`;
}

export function getVisitKey(userIP: string, spaceID: string, visit: VisitType) {
  return `analytics:feedback:visit:${visit}:${spaceID}:${userIP}`;
}
