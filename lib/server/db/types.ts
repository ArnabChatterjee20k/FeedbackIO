import { Models } from "node-appwrite";
export type DB_RESPONSE = {
  message: string;
  success: boolean;
  createdDocs?:{ docId: string; colId: string }[]
  docId?: string;
  colId?: string;
} & {
  [key: string]: string | number | boolean | object | undefined;
};
