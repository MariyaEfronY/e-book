import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Purchase from "@/models/Purchase";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 🔥 STEP 1: Read request body
    const { bookId } = await req.json();
    console.log("📦 Incoming bookId:", bookId);
    if (!bookId || bookId === "undefined") {
      console.log("❌ Invalid bookId received:", bookId);
      return NextResponse.json({ message: "Invalid book ID" }, { status: 400 });
    }
    if (!bookId) {
      return NextResponse.json(
        { message: "Book ID is required" },
        { status: 400 },
      );
    }

    // 🔐 STEP 2: Get cookie (FIXED for Next.js 16)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("❌ No token found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔐 STEP 3: Verify JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      console.log("❌ Invalid token");
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    console.log("🔍 FULL TOKEN:", decoded);

    const userId = decoded.id || decoded.userId || decoded._id;
    console.log("👤 User ID:", userId);

    // 🔍 STEP 4: Fetch book
    const book = await Book.findById(bookId);

    if (!book) {
      console.log("❌ Book not found");
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (book.isFree || book.price === 0) {
      console.log("⚠️ Free book attempted purchase");
      return NextResponse.json(
        { message: "This book is free" },
        { status: 400 },
      );
    }

    console.log("📘 Book:", book.title, "₹", book.price);

    // 🔁 STEP 5: Prevent duplicate purchase
    const existing = await Purchase.findOne({
      userId,
      bookId,
      status: "paid",
    });

    if (existing) {
      console.log("⚠️ Already purchased");
      return NextResponse.json(
        { message: "Already purchased" },
        { status: 200 },
      );
    }

    // 💳 STEP 6: Create Razorpay order
    const order = await razorpay.orders.create({
      amount: book.price * 100, // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // 🔥 good practice
    });

    console.log("💳 Order created:", order.id);

    // 🧾 STEP 7: Save purchase
    await Purchase.create({
      userId,
      bookId,
      amount: book.price,
      orderId: order.id,
      paymentMethod: "razorpay",
      status: "pending",
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("🔥 CREATE ORDER ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create order",
      },
      { status: 500 },
    );
  }
}
