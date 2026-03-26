import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBatch extends Document {
  name: string;
  packageId: string;
  packageName: string;
  days: string[];
  timeStart: string;
  timeEnd: string;
  coachName: string;
  capacity: number;
  enrolled: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    name: { type: String, required: true },
    packageId: { type: String, required: true },
    packageName: { type: String, required: true },
    days: [{ type: String }],
    timeStart: { type: String, required: true },
    timeEnd: { type: String, required: true },
    coachName: { type: String, required: true },
    capacity: { type: Number, required: true, default: 20 },
    enrolled: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BatchSchema.index({ packageId: 1 });
BatchSchema.index({ isActive: 1 });

const Batch: Model<IBatch> =
  mongoose.models.Batch || mongoose.model<IBatch>("Batch", BatchSchema);

export default Batch;
