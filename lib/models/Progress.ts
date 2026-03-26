import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProgress extends Document {
  userId: Types.ObjectId;
  batchId: Types.ObjectId;
  coachId: Types.ObjectId;
  date: string; // "YYYY-MM-DD"
  batting: number;   // 0-100
  bowling: number;   // 0-100
  fielding: number;  // 0-100
  fitness: number;   // 0-100
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    coachId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    batting: { type: Number, min: 0, max: 100, default: 0 },
    bowling: { type: Number, min: 0, max: 100, default: 0 },
    fielding: { type: Number, min: 0, max: 100, default: 0 },
    fitness: { type: Number, min: 0, max: 100, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, date: -1 });
ProgressSchema.index({ batchId: 1, date: -1 });

const Progress: Model<IProgress> =
  mongoose.models.Progress || mongoose.model<IProgress>("Progress", ProgressSchema);

export default Progress;
