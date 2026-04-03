import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Admin only" },
        { status: 403 },
      );
    }

    const books = await Book.find({})
      .populate({
        path: "authorId",
        model: User,
        select: "name email",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      books,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
