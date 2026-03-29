import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { bookId, amount } = await req.json();
    await connectDB();

    // 1. Check if already purchased
    const existing = await Purchase.findOne({ userId: user.id, bookId });
    if (existing) return NextResponse.json({ message: "Already owned" });

    // 2. Create Purchase Record
    const newPurchase = await Purchase.create({
      userId: user.id,
      bookId,
      amount,
      status: "completed",
    });

    return NextResponse.json({ success: true, purchase: newPurchase });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
