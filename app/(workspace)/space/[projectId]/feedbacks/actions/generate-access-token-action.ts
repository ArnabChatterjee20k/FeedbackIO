"use server";

import { SignJWT, jwtVerify } from "jose";

const TRIGGER_SECRET_KEY = new TextEncoder().encode(
  process.env.TRIGGER_SECRET_KEY || "super-secret-key"
);

/**
 * Generates a temporary share token
 * @param expiryHours Number of hours the token should be valid
 * @returns Signed JWT string
 */
export default async function generateAccessToken(expiryHours: number) {
  if (expiryHours <= 0) {
    throw new Error("Expiry must be a positive number of hours");
  }

  const expirySeconds = expiryHours * 3600;

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expirySeconds}s`)
    .sign(TRIGGER_SECRET_KEY);

  return token;
}


/**
 * Verifies a token and returns its status
 * @param token JWT string
 * @returns { valid: boolean, expired: boolean, payload?: JWTPayload }
 */
export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, TRIGGER_SECRET_KEY);
    return { valid: true, expired: false, payload };
  } catch (err: any) {
    // jose throws a specific error for expired tokens
    if (err.code === "ERR_JWT_EXPIRED") {
      return { valid: false, expired: true };
    }
    return { valid: false, expired: false };
  }
}