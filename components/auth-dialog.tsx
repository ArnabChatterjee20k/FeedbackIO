"use client";
import { GoogleSignIn } from "@/app/(login)/login/GoogleSignIn";
import { useFormState } from "react-dom";
import { LandingPageDialogForFeedback } from "./landing-page";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signUpWithGoogle } from "@/lib/server/appwrite";

export default function AuthDialog({ buttonText }: { buttonText: string }) {
  const [state, action] = useFormState(
    () => signUpWithGoogle(window.location.href, window.location.href),
    { error: "" }
  );
  return (
    <LandingPageDialogForFeedback buttonText={buttonText} nonTransparent={true}>
      <form action={action} className="flex flex-col gap-4">
        <h1>Please signin to continue</h1>
        <GoogleSignIn />
      </form>
    </LandingPageDialogForFeedback>
  );
}

async function signInWidgetWithGoogle() {
  return { error: "" };
}
