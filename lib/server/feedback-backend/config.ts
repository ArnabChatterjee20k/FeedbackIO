export const FEEDBACK_BACKEND_URL = process.env.BACKEND_URL;
export const AUTH_TOKEN = process.env["X-FEEDBACK-AUTH-TOKEN"];
export const feedbackBackendDefaultHeader = {"X-FEEDBACK-AUTH-TOKEN":AUTH_TOKEN as string}
