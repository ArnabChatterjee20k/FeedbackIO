export function getFeedbackKey(userIP: string, spaceID: string) {
  return `analytics:feedback:${spaceID}:${userIP}`;
}
