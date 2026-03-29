import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";

export async function GET() {
  try {
    await connectDB();

    // 🎯 Filter: ONLY status "approved" AND isPublished "true"
    const books = await Book.find({
      status: "approved",
      isPublished: true,
    })
      .populate("authorId", "name") // Assuming your User model has 'name'
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
