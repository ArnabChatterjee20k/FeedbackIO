import { Storage, Client } from "appwrite";
export async function createClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  return {
    get storage() {
      return new Storage(client);
    },
  };
}
