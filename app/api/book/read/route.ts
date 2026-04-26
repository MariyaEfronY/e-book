import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import Book from "@/models/Book";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  await connectDB();

  const bookId = req.nextUrl.searchParams.get("bookId");

  // 🔐 get user
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const userId = decoded.id;

  // 🔍 check purchase
  const purchase = await Purchase.findOne({
    userId,
    bookId,
    status: "paid",
  });

  if (!purchase) {
    return NextResponse.json({ message: "Access denied" }, { status: 403 });
  }

  // 📘 get book
  const book = await Book.findById(bookId);

  return NextResponse.json({
    success: true,
    fileUrl: book.fileUrl,
  });
}
