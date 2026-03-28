// /lib/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type Role = "admin" | "author" | "user";

export interface AuthUser extends JWTPayload {
  id: string;
  role: Role;
}

// 🔐 Sign Token
export async function signToken(payload: AuthUser) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);
}

// 🔍 Verify Token
export async function verifyToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secret);
  return payload as AuthUser;
}
