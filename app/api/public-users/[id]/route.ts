import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User"; // For population

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Next.js 16 requires Promise for params
) {
  try {
    await connectDB();
    const { id } = await params;

    const book = await Book.findById(id).populate({
      path: "authorId",
      model: User,
      select: "name",
    });

    if (!book) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, book });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
