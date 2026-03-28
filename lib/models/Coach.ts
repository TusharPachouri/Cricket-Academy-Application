import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoach extends Document {
  name: string;
  slug: string;
  bio: string;
  certifications: string[];
  playingCareer?: string;
  specialization: string;
  yearsOfExperience: number;
  photoUrl: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CoachSchema = new Schema<ICoach>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bio: { type: String, required: true },
    certifications: { type: [String], default: [] },
    playingCareer: { type: String },
    specialization: { type: String, required: true },
    yearsOfExperience: { type: Number, default: 0 },
    photoUrl: { type: String, required: true },
    socialLinks: {
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
    },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CoachSchema.index({ slug: 1 });
CoachSchema.index({ specialization: 1 });

const Coach: Model<ICoach> =
  mongoose.models.Coach || mongoose.model<ICoach>("Coach", CoachSchema);

export default Coach;
