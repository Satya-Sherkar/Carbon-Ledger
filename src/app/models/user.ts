import mongoose, { Schema, Document } from "mongoose";

// Interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  walletAddress: string;
  projects?: mongoose.Types.ObjectId[];
  listings?: mongoose.Types.ObjectId[];
  userType: "buyer" | "seller" | "admin" | "auditor";
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    listings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
    userType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
