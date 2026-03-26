import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAnnouncementRead {
  userId: Types.ObjectId;
  readAt: Date;
}

export interface IAnnouncement extends Document {
  title: string;
  body: string;
  targetRole: "all" | "user" | "admin";
  batchId?: Types.ObjectId;
  reads: IAnnouncementRead[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    targetRole: { type: String, enum: ["all", "user", "admin"], default: "all" },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch" },
    reads: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

AnnouncementSchema.index({ targetRole: 1, createdAt: -1 });
AnnouncementSchema.index({ batchId: 1 });

const Announcement: Model<IAnnouncement> =
  mongoose.models.Announcement || mongoose.model<IAnnouncement>("Announcement", AnnouncementSchema);

export default Announcement;
