"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

/* ─── Counter (reused from StatsBar) ─── */
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Card animation variants ─── */
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 18,
      delay: i * 0.1,
    },
  }),
};

/* ─── Shared card style ─── */
const cardBase: React.CSSProperties = {
  background: "rgba(28,32,38,0.6)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: 16,
  border: "1px solid rgba(78,70,57,0.15)",
  padding: "32px 28px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
  overflow: "hidden",
};

/* ─── Icons ─── */
const VideoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="6" width="18" height="20" rx="3" />
    <path d="M21 12l8-4v16l-8-4z" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 4h12v10a6 6 0 11-12 0V4z" />
    <path d="M10 8H6a2 2 0 00-2 2v1a4 4 0 004 4h2" />
    <path d="M22 8h4a2 2 0 012 2v1a4 4 0 01-4 4h-2" />
    <path d="M12 28h8" />
    <path d="M16 20v8" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#412d00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 10h10M11 6l4 4-4 4" />
  </svg>
);

export default function BentoStats() {
  return (
    <section className="bento-section">
      <div className="bento-inner">
        <ScrollReveal direction="up" delay={0}>
          <div style={{ marginBottom: 48, maxWidth: 600 }}>
            <p style={{
              fontFamily: "var(--font-fell)",
              letterSpacing: "0.2em",
              fontSize: 11,
              color: "#C5A059",
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: 0.85,
            }}>
              The Heritage Pavilion
            </p>
            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontStyle: "italic",
              fontWeight: 700,
              color: "#e5e2d8",
              lineHeight: 1.1,
              marginBottom: 16,
            }}>
              Our Legacy<br />in Numbers
            </h2>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: 15,
              color: "rgba(223,226,235,0.6)",
              lineHeight: 1.7,
              maxWidth: 440,
            }}>
              Refining technique, building character, and cultivating the next 
              generation of cricketing excellence through elite mentorship.
            </p>
          </div>
        </ScrollReveal>

        {/* ─── BENTO GRID ─── */}
        <div className="bento-grid">

          {/* Card 1 — 500+ Athletes (2×2) */}
          <motion.div
            className="bento-card bento-2x2"
            style={cardBase}
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div>
              <div style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(80px, 10vw, 140px)",
                color: "#C5A059",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}>
                <Counter target={500} suffix="+" />
              </div>
              <div style={{
                fontFamily: "var(--font-barlow)",
                fontSize: 20,
                fontWeight: 700,
                color: "#e5e2d8",
                marginTop: 8,
                letterSpacing: "0.02em",
              }}>
                Athletes Trained
              </div>
            </div>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: 13,
              color: "rgba(223,226,235,0.5)",
              lineHeight: 1.65,
              marginTop: 16,
            }}>
              Our alumni represent the highest standards of professional cricket
              across major national leagues.
            </p>
            {/* Decorative bat icon */}
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{
              position: "absolute", bottom: 20, right: 20, opacity: 0.08,
            }}>
              <rect x="35" y="5" width="12" height="50" rx="6" fill="#C5A059" />
              <rect x="28" y="50" width="26" height="16" rx="4" fill="#C5A059" />
              <path d="M41 66v10" stroke="#C5A059" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Card 2 — BCCI Coaches (2×1) */}
          <motion.div
            className="bento-card bento-2x1"
            style={cardBase}
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div style={{
              fontFamily: "var(--font-barlow)",
              fontSize: 18,
              fontWeight: 700,
              color: "#e5e2d8",
              letterSpacing: "0.02em",
              marginBottom: 4,
            }}>
              BCCI Certified Coaches
            </div>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: 12,
              color: "rgba(223,226,235,0.5)",
              marginBottom: 16,
            }}>
              Instruction from world-class tactical minds.
            </p>
            {/* Avatar stack */}
            <div style={{ display: "flex", gap: 0 }}>
              {[
                "linear-gradient(135deg, #C5A059, #8B6914)",
                "linear-gradient(135deg, #7B1C2A, #C5A059)",
                "linear-gradient(135deg, #002D62, #C5A059)",
                "linear-gradient(135deg, #138808, #C5A059)",
              ].map((bg, i) => (
                <div
                  key={i}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: bg,
                    border: "2px solid #1c2026",
                    marginLeft: i > 0 ? -10 : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: "#e5e2d8",
                    fontWeight: 700,
                    fontFamily: "var(--font-barlow)",
                  }}
                >
                  {["AS", "PM", "RK", "VJ"][i]}
                </div>
              ))}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(78,70,57,0.3)",
                border: "2px solid #1c2026",
                marginLeft: -10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                color: "#C5A059",
                fontWeight: 600,
              }}>
                +8
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Video Analysis (1×1) */}
          <motion.div
            className="bento-card bento-1x1"
            style={cardBase}
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <VideoIcon />
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontFamily: "var(--font-fell)",
                fontSize: 10,
                color: "#C5A059",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}>
                Technology
              </div>
              <div style={{
                fontFamily: "var(--font-barlow)",
                fontSize: 16,
                fontWeight: 700,
                color: "#e5e2d8",
              }}>
                Video Analysis
              </div>
              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 12,
                color: "rgba(223,226,235,0.45)",
                marginTop: 6,
                lineHeight: 1.5,
              }}>
                Frame-by-frame breakdowns.
              </p>
            </div>
          </motion.div>

          {/* Card 4 — 3 State Trophies (1×1) */}
          <motion.div
            className="bento-card bento-1x1"
            style={cardBase}
            custom={3}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <TrophyIcon />
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontFamily: "var(--font-fell)",
                fontSize: 10,
                color: "#C5A059",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}>
                Achievements
              </div>
              <div style={{
                fontFamily: "var(--font-barlow)",
                fontSize: 16,
                fontWeight: 700,
                color: "#e5e2d8",
              }}>
                <Counter target={3} suffix="" /> State Trophies
              </div>
              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 12,
                color: "rgba(223,226,235,0.45)",
                marginTop: 6,
                lineHeight: 1.5,
              }}>
                A tradition of winning hardware.
              </p>
            </div>
          </motion.div>

          {/* Card 5 — 15 Years Timeline (1×2) */}
          <motion.div
            className="bento-card bento-1x2"
            style={cardBase}
            custom={4}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div style={{
              fontFamily: "var(--font-barlow)",
              fontSize: 18,
              fontWeight: 700,
              color: "#e5e2d8",
              marginBottom: 4,
            }}>
              <Counter target={15} suffix="" /> Years
            </div>
            <div style={{
              fontFamily: "var(--font-fell)",
              fontSize: 11,
              color: "rgba(223,226,235,0.5)",
              letterSpacing: "0.1em",
              marginBottom: 24,
            }}>
              of Excellence
            </div>
            {/* Timeline */}
            <div style={{ position: "relative", flex: 1 }}>
              <div style={{
                position: "absolute",
                left: 7,
                top: 0,
                bottom: 0,
                width: 2,
                background: "rgba(197,160,89,0.15)",
                borderRadius: 1,
              }} />
              {[
                { year: "2009", label: "Founded" },
                { year: "2014", label: "First XI" },
                { year: "2018", label: "Expansion" },
                { year: "Today", label: "Elite Hub" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 20,
                  position: "relative",
                }}>
                  <div style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: i === 3 ? "#C5A059" : "transparent",
                    border: `2px solid ${i === 3 ? "#C5A059" : "rgba(197,160,89,0.4)"}`,
                    flexShrink: 0,
                    zIndex: 1,
                  }} />
                  <div>
                    <div style={{
                      fontFamily: "var(--font-barlow)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: i === 3 ? "#C5A059" : "#e5e2d8",
                    }}>
                      {item.year}
                    </div>
                    <div style={{
                      fontFamily: "var(--font-dm)",
                      fontSize: 11,
                      color: "rgba(223,226,235,0.45)",
                    }}>
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 6 — Junior to Elite Pathway (2×1) */}
          <motion.div
            className="bento-card bento-2x1"
            style={cardBase}
            custom={5}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div style={{
              fontFamily: "var(--font-barlow)",
              fontSize: 18,
              fontWeight: 700,
              color: "#e5e2d8",
              marginBottom: 20,
            }}>
              Junior to Elite Pathway
            </div>
            {/* Progress bar */}
            <div style={{ display: "flex", gap: 4, width: "100%" }}>
              {["Grassroots", "State Team", "Professional"].map((stage, i) => (
                <div key={i} style={{ flex: 1 }}>
                  <div style={{
                    height: 6,
                    borderRadius: 3,
                    background: i < 2
                      ? "linear-gradient(90deg, #C5A059, #e9c176)"
                      : "rgba(78,70,57,0.25)",
                    marginBottom: 8,
                  }} />
                  <div style={{
                    fontFamily: "var(--font-dm)",
                    fontSize: 10,
                    color: i < 2 ? "#C5A059" : "rgba(223,226,235,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}>
                    {stage}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 7 — Book Trial CTA (1×1) */}
          <motion.div
            className="bento-card bento-1x1"
            style={{
              ...cardBase,
              background: "linear-gradient(135deg, #e9c176, #C5A059)",
              border: "none",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
            custom={6}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{
              fontFamily: "var(--font-barlow)",
              fontSize: 16,
              fontWeight: 800,
              color: "#412d00",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Book Trial
            </div>
            <ArrowIcon />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
