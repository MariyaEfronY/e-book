// /app/api/books/create/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { withAuth } from "@/lib/middleware";

export const POST = withAuth(
  async (req: NextRequest, user) => {
    await connectDB();

    const body = await req.json();

    const book = await Book.create({
      ...body,
      authorId: user.id,
      status: "pending",
    });

    return NextResponse.json(book);
  },
  ["author"], // 🔒 Only authors
);
