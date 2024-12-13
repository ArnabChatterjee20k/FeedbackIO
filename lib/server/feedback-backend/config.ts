export const FEEDBACK_BACKEND_URL = process.env.BACKEND_URL;
export const AUTH_TOKEN = process.env["X_FEEDBACK_AUTH_TOKEN"];
export const feedbackBackendDefaultHeader = {"X-FEEDBACK-AUTH-TOKEN":AUTH_TOKEN as string}
