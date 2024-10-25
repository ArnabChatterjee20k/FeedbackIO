import { Models } from "node-appwrite";
export type SERVER_RESPONSE = {
  message: string;
  success: boolean;
  createdDocs?:{ docId: string; colId: string }[]
  docId?: string;
  colId?: string;
} & {
  [key: string]: string | number | boolean | object | undefined |null;
};
export type SERVER_FETCH_RESPONSE<T> = SERVER_RESPONSE & {
  status:number,
  docs: Models.Document & T | null
}