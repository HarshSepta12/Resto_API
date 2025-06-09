import mongoose from "mongoose";
import { config } from "dotenv";

config();

const url = process.env.MONGODB_URI;

export const dbConnect = async () => {
  try {
    await mongoose.connect(url); 
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};
