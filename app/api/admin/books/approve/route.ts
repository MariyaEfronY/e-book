import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { adminOnly } from "@/lib/withAuth";

export const PATCH = adminOnly(async (req: NextRequest) => {
  try {
    await connectDB();
    const { bookId, status, rejectionReason } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { status, rejectionReason: status === "rejected" ? rejectionReason : "" },
      { new: true },
    );

    return NextResponse.json({ success: true, book: updatedBook });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
});
