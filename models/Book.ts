// /models/Book.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  authorId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  fileUrl: string;
  coverImage?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    // 💰 Price (only used if premium)
    price: {
      type: Number,
      default: 0,
    },

    // 🔥 Free or Paid
    isFree: {
      type: Boolean,
      default: false,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

BookSchema.pre("save", async function (this: IBook) {
  if (this.isFree) {
    this.price = 0;
    return;
  }

  if (!this.price || this.price <= 0) {
    throw new Error("Premium book must have a valid price");
  }
});
export default mongoose.models.Book || mongoose.model("Book", BookSchema);
