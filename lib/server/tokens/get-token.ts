"use server"
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.NEXT_SESSION_COOKIE! || 'kame-hame-kameha';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function createJWT(payload: Record<string,string>) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secretKey);
  
  return token;
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    throw null;
  }
}