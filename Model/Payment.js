import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: String,
  paymentId: String,
  signature: String,
  amount: Number,
  orderItems: Array,
  userId: String,
  payStatus: {
    type: String,
    enum: ["Created", "paid", "failed"],
    default: "Created"
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
