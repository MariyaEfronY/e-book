import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" },
  );

  // 1. Create the response
  const response = NextResponse.json({
    success: true,
    role: user.role, // Pass role to frontend for redirection
    token,
  });

  // 2. Set the Cookie (This is the "Bridge" to your Middleware)
  response.cookies.set("token", token, {
    httpOnly: true, // Security: prevents JS from stealing the token
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });

  return response;
}
