import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { authorOnly } from "@/lib/withAuth";

export const POST = authorOnly(async (req: NextRequest, user) => {
  await connectDB();

  const body = await req.json();

  const book = await Book.create({
    ...body,
    authorId: user.id,
    status: "pending",
  });

  return NextResponse.json({
    success: true,
    book,
  });
});
