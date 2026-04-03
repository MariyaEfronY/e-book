import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { getUserFromRequest } from "@/lib/auth";

// 🛠️ PATCH: Update Book Status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // 1. Define params as a Promise
) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    // 2. UNWRAP PARAMS (The fix for your error)
    const { id } = await params;

    const { action, rejectionReason } = await req.json();

    let updateData: any = {};
    if (action === "approve") {
      updateData = {
        status: "approved",
        isPublished: true,
        rejectionReason: "",
      };
    } else if (action === "reject") {
      updateData = { status: "rejected", isPublished: false, rejectionReason };
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 },
      );
    }

    // 3. FIX DEPRECATION WARNING: Use returnDocument: 'after' instead of new: true
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
    });

    if (!updatedBook) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, book: updatedBook });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// 🗑️ DELETE: Remove a Book
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // 1. Define as Promise
) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    // 2. UNWRAP PARAMS
    const { id } = await params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json(
        { success: false, error: "Book not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Book deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
