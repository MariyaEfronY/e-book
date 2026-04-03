import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const books = await Book.find({
      status: "approved",
      isPublished: true,
    })
      .populate({
        path: "authorId",
        model: User,
        select: "name", // keep it lightweight
      })
      .select(
        "title description price isFree coverImage fileUrl reviewFileUrl isbn createdAt authorId",
      ) // ✅ include new fields
      .sort({ createdAt: -1 })
      .lean();

    // 🔄 Optional: clean response format
    const formattedBooks = books.map((book: any) => ({
      id: book._id,
      title: book.title,
      description: book.description,
      price: book.price,
      isFree: book.isFree,

      // ✅ NEW FIELDS
      isbn: book.isbn,
      previewUrl: book.reviewFileUrl, // alias for frontend clarity
      fullPdfUrl: book.fileUrl,

      coverImage: book.coverImage,

      author: book.authorId?.name || "Unknown",

      createdAt: book.createdAt,
    }));

    return NextResponse.json({
      success: true,
      count: formattedBooks.length,
      books: formattedBooks,
    });
  } catch (error: any) {
    console.error("🔥 API Fetch Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: "Database fetch failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
