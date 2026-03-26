import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IEnrollment extends Document {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  userId?: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  package: string;
  packageId: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  refundStatus?: "none" | "requested" | "approved" | "rejected" | "processed";
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, sparse: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    age: { type: Number },
    package: { type: String, required: true },
    packageId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    refundStatus: { type: String, enum: ["none", "requested", "approved", "rejected", "processed"], default: "none" },
    refundReason: { type: String },
  },
  { timestamps: true }
);

EnrollmentSchema.index({ email: 1 });
EnrollmentSchema.index({ userId: 1 });
EnrollmentSchema.index({ status: 1 });
EnrollmentSchema.index({ razorpayOrderId: 1 });
EnrollmentSchema.index({ createdAt: -1 });

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);

export default Enrollment;
