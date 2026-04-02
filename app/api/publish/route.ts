// src/app/api/books/publish/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { getUserFromRequest } from "@/lib/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "@/lib/s3";

export async function POST(req: NextRequest) {
  console.log("🚀 [API] Publish Book called");

  try {
    // 🔐 1. AUTH CHECK
    const user = await getUserFromRequest(req);

    if (!user || user.role !== "author") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // 📦 2. PARSE FORM DATA
    const formData = await req.formData();

    const pdfFile = formData.get("pdf") as File;
    const reviewFile = formData.get("reviewFile") as File; // ✅ NEW
    const coverImageFile = formData.get("coverImage") as File;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isbn = formData.get("isbn") as string; // ✅ NEW

    const isFree = formData.get("isFree") === "true";
    const price = Number(formData.get("price") || 0);

    // 🛑 VALIDATION
    if (!pdfFile || !title || !description || !isbn) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 🔍 ISBN VALIDATION (NO AUTO GENERATION)
    const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/;
    if (!isbnRegex.test(isbn)) {
      return NextResponse.json(
        { success: false, error: "Invalid ISBN format" },
        { status: 400 },
      );
    }

    // 🚫 DUPLICATE ISBN CHECK
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return NextResponse.json(
        { success: false, error: "ISBN already exists" },
        { status: 400 },
      );
    }

    console.log("📄 Uploading PDF:", pdfFile.name);

    // ☁️ 3. UPLOAD MAIN PDF
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());

    const pdfKey = `authors/${user.id}/books/${Date.now()}-${pdfFile.name.replace(
      /\s+/g,
      "-",
    )}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: pdfKey,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      }),
    );

    const pdfUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${pdfKey}`;

    console.log("✅ PDF uploaded");

    // 📄 4. UPLOAD REVIEW FILE (optional)
    let reviewFileUrl = "";

    if (reviewFile) {
      const reviewBuffer = Buffer.from(await reviewFile.arrayBuffer());

      const reviewKey = `authors/${user.id}/previews/${Date.now()}-${reviewFile.name.replace(
        /\s+/g,
        "-",
      )}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: reviewKey,
          Body: reviewBuffer,
          ContentType: "application/pdf",
        }),
      );

      reviewFileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${reviewKey}`;

      console.log("📄 Review PDF uploaded");
    }

    // 🖼️ 5. UPLOAD COVER IMAGE (optional)
    let coverImageUrl = "";

    if (coverImageFile) {
      const imgBuffer = Buffer.from(await coverImageFile.arrayBuffer());

      const imgKey = `authors/${user.id}/covers/${Date.now()}-${coverImageFile.name.replace(
        /\s+/g,
        "-",
      )}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: imgKey,
          Body: imgBuffer,
          ContentType: coverImageFile.type,
        }),
      );

      coverImageUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imgKey}`;

      console.log("🖼️ Cover uploaded");
    }

    // 💾 6. SAVE TO DATABASE
    const newBook = await Book.create({
      title,
      description,
      price,
      isFree,
      isbn, // ✅ MANUAL ISBN
      authorId: user.id,
      fileUrl: pdfUrl,
      reviewFileUrl, // ✅ PREVIEW FILE
      coverImage: coverImageUrl,
      status: "pending",
    });

    console.log("📚 Book saved:", newBook._id);

    // 🎉 7. RESPONSE
    return NextResponse.json(
      {
        success: true,
        message: "Book uploaded successfully",
        book: newBook,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("🔥 CRITICAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
