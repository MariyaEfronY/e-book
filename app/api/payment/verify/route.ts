import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Purchase from "@/models/Purchase";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const expected = crypto
      .createHmac("sha256", process.env.KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const purchase = await Purchase.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: "paid",
        isVerified: true,
        verifiedAt: new Date(),
      },
      { new: true },
    );

    return NextResponse.json({ success: true, purchase });
  } catch (error) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
