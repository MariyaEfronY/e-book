// src/lib/s3.ts

import { S3Client } from "@aws-sdk/client-s3";

// ✅ Validate env variables early
if (!process.env.AWS_REGION) {
  throw new Error("❌ AWS_REGION is missing");
}
if (!process.env.AWS_ACCESS_KEY) {
  throw new Error("❌ AWS_ACCESS_KEY is missing");
}
if (!process.env.AWS_SECRET_KEY) {
  throw new Error("❌ AWS_SECRET_KEY is missing");
}
if (!process.env.AWS_BUCKET_NAME) {
  throw new Error("❌ AWS_BUCKET_NAME is missing");
}

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});
