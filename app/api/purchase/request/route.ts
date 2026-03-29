import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 1. Get User from Cookie
    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { bookId, amount, transactionId } = await req.json();

    // 2. Check if a request already exists
    const existing = await Purchase.findOne({ userId: decoded.id, bookId });
    if (existing)
      return NextResponse.json(
        { error: "Request already pending or completed" },
        { status: 400 },
      );

    // 3. Create the Purchase Record
    const newPurchase = await Purchase.create({
      userId: decoded.id,
      bookId,
      amount,
      transactionId,
      status: "pending",
    });

    return NextResponse.json({ success: true, purchase: newPurchase });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
