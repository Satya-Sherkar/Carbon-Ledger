import mongoose, { Schema, Document } from "mongoose";

// Interface for Listing document
export interface IListing extends Document {
  title: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  creditAmount: number;
  pricePerCredit: number;
}

const listingSchema = new Schema<IListing>(
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
    creditAmount: {
      type: Number,
      required: true,
    },
    pricePerCredit: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Listing = mongoose.model<IListing>("Listing", listingSchema);
