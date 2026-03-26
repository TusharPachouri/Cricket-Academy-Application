import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITrial extends Document {
  name: string;
  email: string;
  phone: string;
  age: number;
  preferredDate: string; // "YYYY-MM-DD"
  slot: "morning" | "evening";
  programId?: string;
  status: "pending" | "confirmed" | "attended" | "no-show" | "cancelled";
  notes?: string;
  followUpSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrialSchema = new Schema<ITrial>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    preferredDate: { type: String, required: true },
    slot: { type: String, enum: ["morning", "evening"], required: true },
    programId: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "attended", "no-show", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
    followUpSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TrialSchema.index({ email: 1 });
TrialSchema.index({ status: 1 });
TrialSchema.index({ preferredDate: 1, slot: 1 });

const Trial: Model<ITrial> =
  mongoose.models.Trial || mongoose.model<ITrial>("Trial", TrialSchema);

export default Trial;
