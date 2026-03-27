// /app/api/books/access/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Order from "@/models/Order";
import { withAuth } from "@/lib/middleware";

export const POST = withAuth(async (req, user) => {
  await connectDB();

  const { bookId } = await req.json();

  const book = await Book.findById(bookId);

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  // ✅ Free book
  if (book.isFree) {
    return NextResponse.json({ fileUrl: book.fileUrl });
  }

  const order = await Order.findOne({
    userId: user.id,
    bookId,
    paymentStatus: "completed",
  });

  if (!order) {
    return NextResponse.json({ error: "Purchase required" }, { status: 403 });
  }

  return NextResponse.json({ fileUrl: book.fileUrl });
});
