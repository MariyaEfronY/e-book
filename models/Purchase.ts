import mongoose, { Schema } from "mongoose";

const PurchaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    amount: { type: Number, required: true }, // The price they paid
    transactionId: { type: String, required: true }, // UPI/Bank Ref No.
    paymentScreenshot: { type: String }, // Optional: S3 URL or Cloudinary URL
    status: {
      type: String,
      enum: ["pending", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Purchase ||
  mongoose.model("Purchase", PurchaseSchema);
