import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.MONGODB_URI;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(DB_URL!);
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
};
