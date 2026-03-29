// src/lib/auth.ts

import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export type Role = "user" | "author" | "admin";

export interface AuthUser {
  id: string;
  role: Role;
}

// 🔑 Verify JWT
export const verifyToken = (token: string): AuthUser => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as AuthUser;

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

// 🔐 Get user from request (MAIN HELPER)
export const getUserFromRequest = async (
  req: NextRequest,
): Promise<AuthUser | null> => {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.warn("⚠️ No token found in cookies");
      return null;
    }

    const user = verifyToken(token);

    return user;
  } catch (error) {
    console.warn("⚠️ Token verification failed");
    return null;
  }
};
