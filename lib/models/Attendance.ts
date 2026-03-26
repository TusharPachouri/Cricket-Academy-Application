import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAttendance extends Document {
  userId: Types.ObjectId;
  batchId: Types.ObjectId;
  date: string; // "YYYY-MM-DD"
  status: "present" | "absent" | "leave";
  markedBy: Types.ObjectId;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ["present", "absent", "leave"], required: true },
    markedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String },
  },
  { timestamps: true }
);

// Ensure one record per student per batch per date
AttendanceSchema.index({ userId: 1, batchId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ batchId: 1, date: 1 });
AttendanceSchema.index({ userId: 1 });

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
