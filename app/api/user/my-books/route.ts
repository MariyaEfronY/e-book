import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import Book from "@/models/Book";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Identify User from Token
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    const userId = decoded.id;

    // 2. Fetch Purchases and populate Book details
    const myPurchases = await Purchase.find({ userId })
      .populate({
        path: "bookId",
        model: Book,
        select: "title coverImage fileUrl authorId",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, purchases: myPurchases });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
