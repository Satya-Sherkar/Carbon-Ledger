import mongoose, { Schema, Document } from "mongoose";

// Interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);


export const User = mongoose.model<IUser>("User", userSchema);
