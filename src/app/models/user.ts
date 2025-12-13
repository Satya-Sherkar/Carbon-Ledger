import mongoose, { Schema, Document } from "mongoose";

// Interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  clerkId: string;
  credits?: number;
  creditsRetired?: number;
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
    credits: {
      type: Number,
      default: 0,
    },
    creditsRetired: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
