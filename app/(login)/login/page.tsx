"use client";
import { Button } from "@/components/ui/button";
import { signUpWithGoogle } from "@/lib/server/appwrite";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import GridPattern from "@/components/ui/grid-pattern";

import { useFormState, useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { GoogleSignIn } from "./GoogleSignIn";


export default function Page() {
  const [state, action] = useFormState((state)=>signUpWithGoogle(), { error: "" });
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

