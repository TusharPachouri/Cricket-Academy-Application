import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICouponUse {
  email: string;
  enrollmentId?: Types.ObjectId;
  usedAt: Date;
}

export interface ICoupon extends Document {
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  maxUses: number;
  usedCount: number;
  uses: ICouponUse[];
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percent", "flat"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxUses: { type: Number, required: true, default: 100 },
    usedCount: { type: Number, default: 0 },
    uses: [
      {
        email: { type: String },
        enrollmentId: { type: Schema.Types.ObjectId, ref: "Enrollment" },
        usedAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ isActive: 1, expiresAt: 1 });

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
