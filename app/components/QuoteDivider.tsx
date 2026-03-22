"use client";
import { motion } from "framer-motion";

interface Props {
  quote: string;
  attribution?: string;
}

export default function QuoteDivider({ quote, attribution }: Props) {
  return (
    <section style={{
      background: "#0B0F1A",
      width: "100%",
      padding: "84px 0",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Colour vignette from left & right ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 0% 50%, rgba(123,28,42,0.18) 0%, transparent 55%),
                     radial-gradient(ellipse at 100% 50%, rgba(0,45,98,0.22) 0%, transparent 55%)`,
      }} />

      {/* ── Content ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", padding: "0 64px" }}>

        {/* Quote mark */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(44px, 7vw, 72px)",
            color: "var(--gold)",
            lineHeight: 1,
            marginBottom: 4,
            opacity: 0.65,
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          &ldquo;
        </motion.div>

        {/* Quote text */}
        <motion.p
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.35 }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(19px, 3.2vw, 34px)",
            fontStyle: "italic",
            fontWeight: 500,
            color: "rgba(245,240,233,0.86)",
            lineHeight: 1.65,
            letterSpacing: "0.01em",
            marginBottom: attribution ? 28 : 0,
          }}
        >
          {quote}
        </motion.p>

        {/* Attribution */}
        {attribution && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            viewport={{ once: true, amount: 0.5 }}
            style={{
              fontFamily: "var(--font-fell)",
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--gold)",
              opacity: 0.65,
            }}
          >
            — {attribution}
          </motion.p>
        )}
      </div>
    </section>
  );
}
