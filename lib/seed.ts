/**
 * Seed default batch data.
 * Run once: npx tsx lib/seed.ts
 * Safe to re-run — skips existing records.
 */
import { connectDB } from "./mongodb";
import { Batch } from "./models";

const defaultBatches = [
  {
    name: "Junior Morning Batch",
    packageId: "junior",
    packageName: "Junior Batch",
    days: ["Monday", "Wednesday", "Friday"],
    timeStart: "06:00",
    timeEnd: "08:00",
    coachName: "Rajesh Kumar",
    capacity: 20,
  },
  {
    name: "Senior Morning Batch",
    packageId: "senior",
    packageName: "Senior Batch",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeStart: "06:00",
    timeEnd: "08:30",
    coachName: "Amit Sharma",
    capacity: 16,
  },
  {
    name: "Elite Performance Batch",
    packageId: "elite",
    packageName: "Elite Program",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timeStart: "05:30",
    timeEnd: "08:30",
    coachName: "Vikas Yadav",
    capacity: 10,
  },
  {
    name: "Tournament Squad",
    packageId: "tournament",
    packageName: "Tournament Package",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    timeStart: "05:30",
    timeEnd: "09:00",
    coachName: "Rajesh Kumar",
    capacity: 22,
  },
];

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB");

  for (const batch of defaultBatches) {
    const existing = await Batch.findOne({ name: batch.name });
    if (!existing) {
      await Batch.create(batch);
      console.log(`✅ Created batch: ${batch.name}`);
    } else {
      console.log(`⏭  Skipped (already exists): ${batch.name}`);
    }
  }

  console.log("\nSeed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
