import Razorpay from "razorpay";

// 🔍 Debug logs (outside object)
console.log("KEY_ID:", process.env.KEY_ID);
console.log("KEY_SECRET:", process.env.KEY_SECRET);

export const razorpay = new Razorpay({
  key_id: process.env.KEY_ID!,
  key_secret: process.env.KEY_SECRET!,
});
