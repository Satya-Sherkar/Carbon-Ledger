import mongoose from "mongoose";
import { DB_NAME } from "@/constants";

const connectDB = async (): Promise<void> => {
  // Already connected or connecting
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const uri = `${process.env.MONGODB_URI}/${DB_NAME}`;
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing");
    }

    await mongoose.connect(uri);

    // const connectionInstance = await mongoose.connect(uri);
    // console.log(
    //   `\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`
    // );
  } catch (error: unknown) {
    console.error("MongoDB Connection error", error);
    process.exit(1);
  }
};

export default connectDB;
