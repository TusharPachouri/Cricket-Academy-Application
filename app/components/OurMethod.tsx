"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import MobileCardStack from "./MobileCardStack";

const steps = [
  {
    num: "01",
    title: "Assessment & Profiling",
    desc: "Every journey begins with a comprehensive evaluation. We assess your technique, fitness, mental game, and match awareness to build a complete athlete profile.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="12" />
        <path d="M14 8v6l4 4" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Personalized Training Plan",
    desc: "Based on your profile, our BCCI-certified coaches craft a custom training regimen. Every drill, session, and module is tailored to accelerate your specific growth areas.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="20" height="20" rx="3" />
        <path d="M4 10h20M10 4v20" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Intensive Practice Sessions",
    desc: "Train in world-class facilities with video analysis, bowling machines, and simulation nets. Our sessions combine high-intensity drills with strategic match scenarios.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 24l8-8 4 4 8-12" />
        <path d="M18 4h6v6" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Match Simulation & Review",
    desc: "Put your skills to the test in competitive match simulations. Post-match, our coaches deliver detailed video breakdowns and performance analytics to refine your game.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="10,6 22,14 10,22" />
      </svg>
    ),
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 18,
      delay: i * 0.12,
    },
  }),
};

export default function OurMethod() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setActiveStep(idx);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -40% 0px" }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="method-section" id="about">
      <div className="method-inner">
        {/* Sticky left panel */}
        <div className="method-left">
          <ScrollReveal direction="up" delay={0}>
            <p style={{
              fontFamily: "var(--font-fell)",
              letterSpacing: "0.2em",
              fontSize: 11,
              color: "#C5A059",
              textTransform: "uppercase",
              marginBottom: 12,
              opacity: 0.85,
            }}>
              Our Method
            </p>
            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(36px, 5vw, 52px)",
              fontStyle: "italic",
              fontWeight: 700,
              color: "#e5e2d8",
              lineHeight: 1.1,
              marginBottom: 20,
            }}>
              The Path to<br />Excellence
            </h2>
            <p style={{
              fontFamily: "var(--font-dm)",
              fontSize: 14,
              color: "rgba(223,226,235,0.55)",
              lineHeight: 1.75,
              marginBottom: 32,
            }}>
              A proven four-step system that has produced
              national-level athletes for over 15 years.
            </p>

            {/* Step indicators */}
            <div style={{ display: "flex", gap: 8 }}>
              {steps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: activeStep === i ? 32 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: activeStep === i ? "#C5A059" : "rgba(197,160,89,0.2)",
                    transition: "all 0.4s ease",
                  }}
                />
              ))}
            </div>

            {/* Large background number */}
            <div className="method-step-num">
              {String(activeStep + 1).padStart(2, "0")}
            </div>
          </ScrollReveal>
        </div>

        {/* Scrolling right panel */}
        <div className="method-right">
          <MobileCardStack topOffset={72}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              className={`method-step ${activeStep === i ? "active" : ""}`}
              custom={i}
              variants={stepVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="method-step-indicator">{step.num}</div>
              <div style={{ marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{
                fontFamily: "var(--font-barlow)",
                fontSize: 22,
                fontWeight: 700,
                color: "#e5e2d8",
                marginBottom: 12,
                letterSpacing: "0.02em",
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: "var(--font-dm)",
                fontSize: 14,
                color: "rgba(223,226,235,0.55)",
                lineHeight: 1.75,
              }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
          </MobileCardStack>
        </div>
      </div>
    </section>
  );
}
