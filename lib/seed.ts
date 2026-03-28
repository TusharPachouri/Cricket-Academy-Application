/**
 * Seed default batch data.
 * Run once: npx tsx lib/seed.ts
 * Safe to re-run — skips existing records.
 */
import { connectDB } from "./mongodb";
import { Batch, Coach } from "./models";

const defaultCoaches = [
  {
    name: "Rajesh Kumar",
    slug: "rajesh-kumar",
    bio: "BCCI Level 2 Certified coach with over 15 years of experience in mentoring state-level players. Specializes in advanced batting techniques and mental conditioning.",
    certifications: ["BCCI Level 2", "ICC Elite Coach Certified"],
    playingCareer: "Former Ranji Trophy player for Uttar Pradesh with 50+ matches.",
    specialization: "Head Coach & Batting Expert",
    yearsOfExperience: 18,
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    displayOrder: 1,
  },
  {
    name: "Amit Sharma",
    slug: "amit-sharma",
    bio: "Expert batting consultant focusing on T20 power-hitting and modern game analysis. Helped numerous junior players transition to professional cricket.",
    certifications: ["BCCI Level 1", "Performance Analyst"],
    playingCareer: "Played for North Zone in Deodhar Trophy.",
    specialization: "Senior Batting Consultant",
    yearsOfExperience: 12,
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
    displayOrder: 2,
  },
  {
    name: "Vikas Yadav",
    slug: "vikas-yadav",
    bio: "Pace bowling specialist with a focus on swing and seam movement. Dedicated to developing fast bowlers for the next generation.",
    certifications: ["BCCI Level 1", "Strength & Conditioning Coach"],
    playingCareer: "Represented India U-19 and played various A games.",
    specialization: "Pace Bowling Specialist",
    yearsOfExperience: 10,
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
    displayOrder: 3,
  },
];

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

  for (const coach of defaultCoaches) {
    const existing = await Coach.findOne({ slug: coach.slug });
    if (!existing) {
      await Coach.create(coach);
      console.log(`✅ Created coach: ${coach.name}`);
    } else {
      console.log(`⏭  Skipped coach (already exists): ${coach.name}`);
    }
  }

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
