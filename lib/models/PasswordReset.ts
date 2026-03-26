import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPasswordReset extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

PasswordResetSchema.index({ email: 1 });
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto-delete on expiry

const PasswordReset: Model<IPasswordReset> =
  mongoose.models.PasswordReset ||
  mongoose.model<IPasswordReset>("PasswordReset", PasswordResetSchema);

export default PasswordReset;
