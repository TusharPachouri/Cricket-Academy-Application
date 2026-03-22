"use client";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const programs = [
  {
    number: "01",
    title: "Junior Academy",
    age: "Ages 8–14",
    desc: "Foundation skills, hand-eye coordination, fitness, and love for the game. Structured coaching in batting, bowling, and fielding fundamentals.",
    icon: "junior",
  },
  {
    number: "02",
    title: "Senior Batting",
    age: "Advanced",
    desc: "Technique refinement, shot selection, mental conditioning, and match simulation. Work with top-tier batting coaches one-on-one.",
    icon: "bat",
  },
  {
    number: "03",
    title: "Pace Bowling",
    age: "Intermediate+",
    desc: "Run-up mechanics, seam position, yorker mastery, pace development, and injury prevention protocol under expert supervision.",
    icon: "bowl",
  },
  {
    number: "04",
    title: "Wicket Keeping",
    age: "All Levels",
    desc: "Glove work, footwork, diving technique, and leadership from behind the stumps. Full keeping-specific training modules.",
    icon: "keep",
  },
];

function ProgramIcon({ type }: { type: string }) {
  if (type === "junior") return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="10" r="6" stroke="var(--gold)" strokeWidth="2" />
      <path d="M8 32c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (type === "bat") return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="16" y="2" width="5" height="22" rx="2.5" stroke="var(--gold)" strokeWidth="2" />
      <rect x="12" y="22" width="13" height="8" rx="2" stroke="var(--gold)" strokeWidth="2" />
      <path d="M18.5 30v4" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  if (type === "bowl") return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="24" cy="12" r="8" stroke="var(--gold)" strokeWidth="2" />
      <path d="M24 4c0 0-4 4-4 8s4 8 4 8" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 30l12-14" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6" cy="31" r="2" fill="var(--gold)" />
    </svg>
  );
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="10" y="8" width="16" height="20" rx="3" stroke="var(--gold)" strokeWidth="2" />
      <path d="M14 8V6a2 2 0 014 0v2M22 8V6a2 2 0 014 0v2" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 16h16" stroke="var(--gold)" strokeWidth="1.5" />
    </svg>
  );
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 90,
      damping: 18,
      delay: i * 0.12,
    },
  }),
};

export default function Programs() {
  return (
    <section style={{ background: "var(--cream)" }} className="w-full py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-16">
            <p style={{
              fontFamily: "var(--font-fell)",
              letterSpacing: "0.2em",
              fontSize: 11,
              color: "var(--gold)",
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: 0.85,
            }}>
              What We Offer
            </p>
            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontStyle: "italic",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.1,
            }}>
              Programs Built<br />for Champions
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={i}
              className="program-card"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              style={{
                background: "var(--card-bg)",
                borderRadius: 16,
                padding: "28px 24px",
                borderTop: "3px solid var(--gold)",
                height: "100%",
                cursor: "default",
                boxShadow: "0 2px 16px rgba(11,15,26,0.06)",
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <ProgramIcon type={p.icon} />
              </div>
              <div style={{
                fontFamily: "var(--font-fell)",
                fontSize: 11,
                color: "var(--gold)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}>
                {p.number} — {p.age}
              </div>
              <h3 style={{
                fontFamily: "var(--font-barlow)",
                fontSize: 22,
                fontWeight: 700,
                color: "var(--dark)",
                marginBottom: 12,
                letterSpacing: "0.02em",
              }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: "var(--font-dm)", fontSize: 13.5, color: "var(--text-gray)", lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
