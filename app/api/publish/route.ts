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
      console.warn("🚫 Unauthorized access");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    console.log("👤 Author:", user.id);

    // 📡 2. CONNECT DB
    await connectDB();

    // 📦 3. PARSE FORM DATA
    const formData = await req.formData();

    const pdfFile = formData.get("pdf") as File;
    const coverImageFile = formData.get("coverImage") as File;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    const isFree = formData.get("isFree") === "true";
    const price = Number(formData.get("price") || 0);

    // 🛑 VALIDATION
    if (!pdfFile || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log("📄 PDF:", pdfFile.name);

    // ☁️ 4. UPLOAD PDF TO S3
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
      authorId: user.id,
      fileUrl: pdfUrl,
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
