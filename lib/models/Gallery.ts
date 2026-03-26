import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  category: "training" | "matches" | "events" | "achievements";
  type: "photo" | "video";
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    caption: { type: String },
    category: {
      type: String,
      enum: ["training", "matches", "events", "achievements"],
      default: "training",
    },
    type: { type: String, enum: ["photo", "video"], default: "photo" },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GallerySchema.index({ category: 1, isPublished: 1 });
GallerySchema.index({ displayOrder: 1 });

const Gallery: Model<IGallery> =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;
