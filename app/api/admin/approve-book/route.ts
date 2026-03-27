// /app/api/admin/approve-book/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { withAuth } from "@/lib/middleware";

export const POST = withAuth(
  async (req: NextRequest) => {
    await connectDB();

    const { bookId, status } = await req.json();

    const book = await Book.findByIdAndUpdate(
      bookId,
      { status },
      { new: true },
    );

    return NextResponse.json(book);
  },
  ["admin"], // 🔥 Only admin
);
