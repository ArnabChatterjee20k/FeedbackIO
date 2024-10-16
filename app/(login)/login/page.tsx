"use client";
import { Button } from "@/components/ui/button";
import { signUpWithGoogle } from "@/lib/server/appwrite";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import GridPattern from "@/components/ui/grid-pattern";

import { useFormState, useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import RetroGrid from "@/components/ui/retro-grid";

export default function Page() {
  const [state, action] = useFormState(signUpWithGoogle, { error: "" });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-black">
      <form action={action} className="w-full max-w-md space-y-5">
        <div className="text-center">
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.15] text-black sm:text-6xl sm:leading-[1.15]">
            Hello, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 animate-background-pan bg-[length:200%_200%] whitespace-nowrap">
              builders
            </span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Capture opinions, inspire innovation
          </p>
        </div>
        <GoogleSignIn />
        <div className="text-center text-xs text-gray-400">
          By continuing, you agree to the{" "}
          <Link href="/terms" className="text-orange-500 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-orange-500 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </form>
      <GridPattern
        width={80}
        height={80}
        x={-1}
        y={-1}
        className={cn("responsive-mask")}
      />
    </div>
  );
}

export function GoogleSignIn() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-white text-gray-900 hover:bg-white/20"
    >
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
        <path fill="none" d="M1 1h22v22H1z" />
      </svg>
      Continue with Google
      {pending ? <Loader2 className="animate-spin" /> : null}
    </Button>
  );
}
