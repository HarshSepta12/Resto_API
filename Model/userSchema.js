import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    unique: true,
    required: true,
    unique: true,
    trim: true,
  },
  password: { type: String, required: true, unique: true, trim: true },
  role: {
    type: String,
    enum: ["user", "admin"], // only allow 'user' or 'admin' roles
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model("RegisterUser", userSchema);
