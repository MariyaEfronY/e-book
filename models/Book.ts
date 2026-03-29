import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  authorId: mongoose.Types.ObjectId; // Links to User
  fileUrl: string; // S3 PDF Link
  coverImage: string; // S3 Image Link
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string; // Why admin rejected it
  isPublished: boolean;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, required: true },
    coverImage: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isPublished: { type: Boolean, default: false },
    rejectionReason: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
