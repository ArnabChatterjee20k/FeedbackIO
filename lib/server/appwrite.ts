"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Client,
  Account,
  OAuthProvider,
  Databases,
  Storage,
} from "node-appwrite";
export async function createSessionClient(token?: string) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
  if (token) {
    client.setSession(token as string);
  } else {
    const session = cookies().get(
      token ? token : process.env.NEXT_SESSION_COOKIE!
    );
    if (!session || !session.value) {
      throw new Error("No session");
    }
    client.setSession(session.value);
  }

  return {
    get account() {
      return new Account(client);
    },
    get db() {
      return new Databases(client);
    },
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get db() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}
export async function signUpWithGoogle(
  nextURI?: string,
  redirectToNextInCaseOfFailure?: string
) {
  const { account } = await createAdminClient();

  const origin = headers().get("origin");
  const successURL = `${origin}/oauth${
    nextURI ? `?next=${encodeURIComponent(nextURI)}` : ""
  }`;
  const failureURL = redirectToNextInCaseOfFailure || `${origin}/login`;
  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Google,
    successURL,
    failureURL
  );
  return redirect(redirectUrl as string);
}

export async function signOut() {
  const { account } = await createSessionClient();
  await account.deleteSessions();
  cookies().delete(process.env.NEXT_SESSION_COOKIE!);
}
