"use client";
import { motion } from "framer-motion";

const items = [
  "Test Cricket Excellence",
  "★",
  "500+ Athletes Trained",
  "★",
  "BCCI Certified Coaches",
  "★",
  "Video Analysis",
  "★",
  "Junior to Elite",
  "★",
  "Braj Cricket Academy",
  "★",
  "Est. 2009",
  "★",
  "Ranji Trophy Alumni",
  "★",
  "World-Class Facilities",
  "★",
];

const doubled = [...items, ...items];

export default function Marquee() {
  return (
    <div
      style={{
        background: "#0B0F1A",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        overflow: "hidden",
        paddingTop: 14,
        paddingBottom: 14,
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Fade edges */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to right, #0B0F1A 0%, transparent 8%, transparent 92%, #0B0F1A 100%)",
      }} />

      <motion.div
        style={{ display: "flex", gap: 0, width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: item === "★" ? "serif" : "var(--font-fell)",
              fontSize: item === "★" ? 10 : 12,
              letterSpacing: item === "★" ? "0" : "0.22em",
              color: item === "★" ? "var(--gold)" : "rgba(245,240,233,0.55)",
              textTransform: "uppercase",
              padding: "0 28px",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
