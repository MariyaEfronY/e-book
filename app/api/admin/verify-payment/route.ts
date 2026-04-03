import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import Book from "@/models/Book"; // Must be imported to register the schema
import User from "@/models/User"; // Must be imported to register the schema
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 💡 FIX: Explicitly pass the Model objects into populate
    const purchases = await Purchase.find({})
      .populate({
        path: "userId",
        model: User, // Explicitly tell Mongoose to use the User model
        select: "name email",
      })
      .populate({
        path: "bookId",
        model: Book, // Explicitly tell Mongoose to use the Book model
        populate: {
          path: "authorId",
          model: User, // Deep population also needs the explicit model
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, purchases });
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { purchaseId, status } = await req.json();

    if (!purchaseId) {
      return NextResponse.json(
        { error: "Purchase ID is missing" },
        { status: 400 },
      );
    }

    // Validates if the ID is a valid MongoDB ObjectId to prevent casting errors
    const updated = await Purchase.findByIdAndUpdate(
      purchaseId,
      { status },
      { returnDocument: "after" },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Purchase record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, purchase: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
