import { Models } from "node-appwrite";
export type Space = Models.Document & {
  name: string;
  user_id: string;
  logo: string;
  thank_you_page: string;
};
