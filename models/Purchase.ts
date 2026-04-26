import mongoose, { Schema } from "mongoose";

const PurchaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },

    amount: { type: Number, required: true },

    // 🔹 OLD (manual)
    transactionId: { type: String },
    paymentScreenshot: { type: String },

    // 🔹 NEW (Razorpay)
    orderId: { type: String },
    paymentId: { type: String },
    signature: { type: String },

    paymentMethod: {
      type: String,
      enum: ["manual", "razorpay"],
      default: "manual",
    },

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
