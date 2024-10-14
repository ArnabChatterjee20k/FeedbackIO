import { createSessionClient } from "./oauth";
export async function getUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    return null;
  }
}
