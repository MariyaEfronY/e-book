// /app/api/orders/create/route.ts

import { NextResponse } from "next/server";
import Order from "@/models/Order";
import Book from "@/models/Book";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const { userId, bookId } = await req.json();

  const book = await Book.findById(bookId);

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  if (book.isFree) {
    return NextResponse.json({ message: "Free book, no purchase needed" });
  }

  const order = await Order.create({
    userId,
    bookId,
    amount: book.price,
    paymentStatus: "completed",
  });

  return NextResponse.json({ message: "Purchased", order });
}
