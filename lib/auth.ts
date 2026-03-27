// /lib/auth.ts

import jwt from "jsonwebtoken";

export type Role = "user" | "author" | "admin";

export interface AuthUser {
  id: string;
  role: Role;
}

// 🔑 Verify token
export const verifyToken = (token: string): AuthUser => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
  } catch {
    throw new Error("Invalid or expired token");
  }
};
