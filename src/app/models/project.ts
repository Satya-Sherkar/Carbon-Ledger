import mongoose, { Schema, Document } from "mongoose";

// Interface for Project document
export interface IProject extends Document {
  title: string;
  description: string;
  photoUrl?: string;
  owner: mongoose.Types.ObjectId;
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
    photoUrl: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProject>("Project", projectSchema);
