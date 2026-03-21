"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "Students Trained" },
  { value: 12, suffix: "", label: "National Players" },
  { value: 15, suffix: "", label: "Years of Excellence" },
  { value: 3, suffix: "", label: "State Trophies" },
];

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

const statVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function StatsBar() {
  return (
    <section style={{ background: "var(--navy)", position: "relative" }} className="w-full py-16 px-8">
      {/* Gold top accent line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 3,
        background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
        opacity: 0.6,
      }} />

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="relative flex flex-col items-center text-center"
            custom={i}
            variants={statVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {i > 0 && (
              <div
                className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2"
                style={{ width: 1, height: 64, background: "var(--gold)", opacity: 0.5 }}
              />
            )}
            <div style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(48px, 6vw, 80px)",
              color: "var(--gold)",
              lineHeight: 1,
            }}>
              <Counter target={stat.value} suffix={stat.suffix} />
            </div>
            <div style={{
              fontFamily: "var(--font-fell)",
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.12em",
              marginTop: 8,
              textTransform: "uppercase",
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
