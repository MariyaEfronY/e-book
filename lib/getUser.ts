// /lib/getUser.ts
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export async function getUser() {
  try {
    const cookieStore = cookies(); // ✅ required step
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      throw new Error("No token");
    }

    return await verifyToken(token);
  } catch (err) {
    throw new Error("Unauthorized");
  }
}
