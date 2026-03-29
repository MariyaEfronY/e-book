import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { getUserFromRequest } from "@/lib/auth";

// --- FETCH ALL BOOKS FOR ADMIN ---
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    // Fetch all books and populate author details (assuming name/email are in User model)
    const books = await Book.find()
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, books });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- UPDATE BOOK STATUS (APPROVE/REJECT) ---
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookId, status, rejectionReason } = await req.json();
    await connectDB();

    // 1. Prepare the dynamic update object
    const updateData: any = { status };

    if (status === "approved") {
      updateData.isPublished = true; // ✅ This will now be included
      updateData.rejectionReason = "";
    } else if (status === "rejected") {
      updateData.isPublished = false;
      updateData.rejectionReason = rejectionReason || "No reason provided";
    }

    // 2. THE FIX: Pass 'updateData' variable, not a new manual object
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updateData, // 👈 This was the mistake. We use the variable now.
      { new: true },
    );

    if (!updatedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Book ${status} and ${status === "approved" ? "published" : "hidden"} successfully`,
      book: updatedBook,
    });
  } catch (error: any) {
    console.error("🔥 Patch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
