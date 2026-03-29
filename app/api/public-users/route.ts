import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User"; // 👈 This MUST be imported here

export async function GET() {
  try {
    await connectDB();

    // 🎯 Use the Model object directly in populate to prevent registration errors
    const books = await Book.find({
      status: "approved",
      isPublished: true,
    })
      .populate({
        path: "authorId",
        model: User, // 👈 Passing the actual 'User' model object fixes your 500 error
        select: "name", // Only pull the name, keep it lightweight
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error: any) {
    console.error("🔥 API Fetch Error:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Database link failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
