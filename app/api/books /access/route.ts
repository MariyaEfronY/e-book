import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import Order from "@/models/Order";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(
  async (req: NextRequest, user) => {
    try {
      await connectDB();

      const { bookId } = await req.json();

      // 🛑 Validate input
      if (!bookId) {
        return NextResponse.json(
          { error: "Book ID is required" },
          { status: 400 },
        );
      }

      // 📚 Find book
      const book = await Book.findById(bookId);

      if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 });
      }

      // ✅ Free book access
      if (book.isFree) {
        return NextResponse.json({
          success: true,
          fileUrl: book.fileUrl,
        });
      }

      // 💰 Check purchase
      const order = await Order.findOne({
        userId: user.id,
        bookId,
        paymentStatus: "completed",
      });

      if (!order) {
        return NextResponse.json(
          { error: "Purchase required" },
          { status: 403 },
        );
      }

      // ✅ Paid access granted
      return NextResponse.json({
        success: true,
        fileUrl: book.fileUrl,
      });
    } catch (error) {
      console.error("BOOK ACCESS ERROR:", error);

      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  },
  ["user", "author", "admin"], // 🔓 All logged-in roles can access
);
