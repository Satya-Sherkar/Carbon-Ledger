import mongoose, { Schema, Document } from "mongoose";

// Interface for Project document
export interface IProject extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  ownerWalletAddress: string;
  isVerified: boolean;
  credits: number;
  projectId: number;
  isListed: boolean;
  pricePerCredit: number;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerWalletAddress: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    credits: {
      type: Number,
      required: true,
      default: 0,
    },
    projectId: {
      type: Number,
      required: true,
      unique: true,
    },
    isListed: {
      type: Boolean,
      required: true,
      default: false,
    },
    pricePerCredit: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);
