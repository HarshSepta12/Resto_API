
import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: {  type: String, required: true,},
    description: String,
    price: { type: Number, required: true,},
    imageUrl: String,
    isAvailable: {type: Boolean, default: true,},
    //isVeg: {type: Boolean, default: true,},
    spiceLevel: {type: String, enum: ["Low", "Medium", "High"],},
    ingredients: [String],
    category: { type: mongoose.Schema.Types.ObjectId,
    ref: "Category", required: true, },},
  { timestamps: true }
);

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);

