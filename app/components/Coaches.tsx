"use client";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const coaches = [
  {
    initials: "RK",
    name: "Rajesh Kumar",
    credential: "Former Ranji Trophy Captain",
    bio: "25 years of coaching experience. Trained 6 state-level players from scratch. Specialist in batting technique and mental conditioning.",
    color: "var(--gold)",
    avatarBg: "var(--gold)",
  },
  {
    initials: "AS",
    name: "Arjun Singh",
    credential: "Pace Bowling Specialist",
    bio: "Ex-first-class pacer with 180+ wickets. Developed the academy's proprietary pace development framework used by 3 current national-level bowlers.",
    color: "var(--maroon)",
    avatarBg: "var(--maroon)",
  },
  {
    initials: "PM",
    name: "Priya Mehta",
    credential: "Women's National Team Alumni",
    bio: "Pioneering women's cricket in the region. Holds certifications from ECB and BCCI. Specialist in wicket-keeping and junior development programs.",
    color: "var(--saffron)",
    avatarBg: "var(--saffron)",
  },
];

const slideVariants = (direction: "left" | "right") => ({
  hidden: { opacity: 0, x: direction === "left" ? -60 : 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
});

export default function Coaches() {
  return (
    <section style={{ background: "var(--dark)" }} className="w-full py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-16">
            <h2 style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1, color: "#fff" }}>
              <span style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.02em" }}>Meet the </span>
              <span style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--gold)",
              }}>Coaches</span>
            </h2>
            <p style={{ fontFamily: "var(--font-dm)", fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 12, maxWidth: 480 }}>
              Every coach at Braj Cricket Academy is a former player, a lifelong student of the game, and a genuine mentor.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coaches.map((c, i) => (
            <motion.div
              key={i}
              variants={slideVariants(i % 2 === 0 ? "left" : "right")}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              style={{
                background: "rgba(0,45,98,0.25)",
                border: "1px solid rgba(201,168,76,0.18)",
                borderRadius: 20,
                padding: "32px 28px",
              }}
            >
              {/* Avatar */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: c.avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}>
                <span style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 22, color: "#fff" }}>
                  {c.initials}
                </span>
              </div>

              <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 22, color: "#fff", marginBottom: 6 }}>
                {c.name}
              </h3>
              <p style={{
                fontFamily: "var(--font-fell)",
                fontSize: 11,
                color: c.color,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}>
                {c.credential}
              </p>
              <p style={{ fontFamily: "var(--font-dm)", fontSize: 13.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                {c.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
