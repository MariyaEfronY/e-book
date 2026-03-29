import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import Book from "@/models/Book";
import User from "@/models/User";

// GET: Fetch all pending purchases
export async function GET() {
  try {
    await connectDB();
    // Fetch everything: pending, completed, and rejected
    const requests = await Purchase.find()
      .populate({ path: "userId", model: User, select: "name email" })
      .populate({ path: "bookId", model: Book, select: "title price" })
      .sort({ updatedAt: -1 }); // Show most recent activity first

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PATCH: Approve a purchase
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { purchaseId } = await req.json();

    const updated = await Purchase.findByIdAndUpdate(
      purchaseId,
      { status: "completed" },
      { new: true },
    );

    if (!updated)
      return NextResponse.json(
        { error: "Purchase not found" },
        { status: 404 },
      );

    return NextResponse.json({ success: true, message: "Purchase Approved!" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
