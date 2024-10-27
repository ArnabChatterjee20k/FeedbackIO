export const dynamic = "force-dynamic";
import { createAdminClient } from "@/lib/server/appwrite";
import { NextRequest } from "next/server";
import { OAuthProvider } from "node-appwrite";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export async function GET(req: NextRequest) {
    const next = req.nextUrl.searchParams.get("next") || "/";    
    
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        
        const successURL = `${baseUrl}/api/identity/oauth?next=${encodeURIComponent(next)}`;
        const failureURL = `${baseUrl}/api/identity/oauth?next=${encodeURIComponent(next)}&error=true`;

        // Fetch Google OAuth URL
        const redirectUrl = await signUpWithGoogle(successURL, failureURL);
        
        if (!redirectUrl) {
            throw new Error("No redirect URL returned from Appwrite");
        }

        console.log("Redirecting to:", redirectUrl);
        return Response.redirect(redirectUrl);
    } catch (error) {
        console.error("OAuth Error:", error);
        // Redirect to the next URL with an error parameter
        return Response.redirect(`${next}?error=auth_failed`);
    }
}

async function signUpWithGoogle(successURL: string, failureURL: string) {
    try {
        const { account } = await createAdminClient();
        
        // Debug logging before making the request
        console.log("Creating OAuth2 token with:", {
            provider: OAuthProvider.Google,
            successURL,
            failureURL
        });

        const redirectUrl = await account.createOAuth2Token(
            OAuthProvider.Google,
            successURL,
            failureURL
        );

        console.log("Received redirect URL:", redirectUrl);
        return redirectUrl;
    } catch (error) {
        console.error("Appwrite OAuth Error:", error);
        throw error;
    }
}