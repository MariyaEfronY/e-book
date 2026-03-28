import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/Book";
import { authorOnly } from "@/lib/withAuth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "@/lib/s3";

export const POST = authorOnly(async (req: NextRequest, user) => {
  console.log("🚀 [API] Request received at /api/books/publish");
  console.log("👤 [API] Authenticated User:", user?.id || "No User Found");

  try {
    // 1. Database Connection
    console.log("📡 [API] Connecting to MongoDB...");
    await connectDB();
    console.log("✅ [API] MongoDB Connected.");

    // 2. Parse FormData
    console.log("📦 [API] Parsing FormData...");
    const formData = await req.formData();

    const pdfFile = formData.get("pdf") as File;
    const title = formData.get("title") as string;
    const isFree = formData.get("isFree") === "true";
    const price = Number(formData.get("price") || 0);

    if (!pdfFile) {
      console.error("❌ [API] Error: No PDF file found in request");
      return NextResponse.json({ error: "No PDF file found" }, { status: 400 });
    }
    console.log(
      `📄 [API] File detected: ${pdfFile.name} (${pdfFile.size} bytes)`,
    );

    // 3. S3 Upload
    console.log("☁️ [API] Preparing S3 Upload...");
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const fileName = `authors/${user.id}/books/${Date.now()}-${pdfFile.name.replace(/\s+/g, "-")}`;

    console.log(
      `☁️ [API] Uploading to Bucket: ${BUCKET_NAME}, Key: ${fileName}`,
    );

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: "application/pdf",
      }),
    );
    console.log("✅ [API] S3 Upload Successful.");

    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // 4. Save to MongoDB
    console.log("💾 [API] Saving book details to Database...");
    const newBook = await Book.create({
      title,
      description: formData.get("description"),
      price,
      isFree,
      authorId: user.id,
      fileUrl,
      coverImage: formData.get("coverImage"),
      status: "pending",
    });
    console.log("✅ [API] Book saved to DB with ID:", newBook._id);

    return NextResponse.json({ success: true, book: newBook }, { status: 201 });
  } catch (error: any) {
    console.error("🔥 [API] CRITICAL ERROR:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
});
