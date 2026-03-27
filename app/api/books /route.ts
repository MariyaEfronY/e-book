// /app/api/books/route.ts

import { NextResponse } from "next/server";
import Book from "@/models/Book";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();

  const books = await Book.find({ status: "approved" })
    .populate("authorId", "name")
    .populate("categoryId", "name");

  return NextResponse.json(books);
}
