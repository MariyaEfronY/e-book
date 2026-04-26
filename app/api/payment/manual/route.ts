import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Purchase from "@/models/Purchase";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, bookId, transactionId, screenshot } = await req.json();

    const book = await Book.findById(bookId);

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    await Purchase.create({
      userId,
      bookId,
      amount: book.price,
      transactionId,
      paymentScreenshot: screenshot,
      paymentMethod: "manual",
      status: "pending",
    });

    return NextResponse.json({
      message: "Waiting for admin approval",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Manual payment failed" },
      { status: 500 },
    );
  }
}
