import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { adminOnly } from "@/lib/withAuth";

export const POST = adminOnly(async (req: NextRequest) => {
  try {
    await connectDB();

    const { bookId, status } = await req.json();

    // 🛑 Validate input
    if (!bookId || !status) {
      return NextResponse.json(
        { error: "Book ID and status are required" },
        { status: 400 },
      );
    }

    // 🛑 Validate allowed status values
    const allowedStatus = ["pending", "approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    // 🔍 Update book
    const book = await Book.findByIdAndUpdate(
      bookId,
      { status },
      { new: true },
    );

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("APPROVE BOOK ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
});
