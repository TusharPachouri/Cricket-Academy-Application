"use client";
import { motion } from "framer-motion";

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function CTAFooter() {
  return (
    <section style={{ background: "#0B0F1A" }} className="w-full py-28 px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 style={{ lineHeight: 1.05, marginBottom: 40 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.25em", overflow: "hidden" }}>
            {["Your", "Journey", "Starts"].map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(48px, 8vw, 110px)",
                  color: "#fff",
                  display: "inline-block",
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.span
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(36px, 6vw, 88px)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--gold)",
              display: "block",
              textAlign: "center",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            on the pitch.
          </motion.span>
        </h2>

        <motion.p
          style={{ fontFamily: "var(--font-dm)", fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto 48px" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
        >
          Limited spots available each season. Join 500+ athletes who chose excellence over average.
        </motion.p>

        <motion.div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <button
            className="cta-btn"
            style={{
              background: "linear-gradient(135deg, var(--gold) 0%, var(--saffron) 100%)",
              color: "var(--dark)",
              fontFamily: "var(--font-barlow)",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "20px 56px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(201,168,76,0.4)",
            }}
          >
            Join the Academy →
          </button>
          <span style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
            No commitment trials available · Contact us at{" "}
            <a
              href="mailto:brajcricket@academy.in"
              style={{ color: "var(--gold)", opacity: 0.75, textDecoration: "none" }}
            >
              brajcricket@academy.in
            </a>
          </span>
        </motion.div>
      </div>

      {/* Footer line */}
      <div
        className="max-w-6xl mx-auto"
        style={{
          marginTop: 80,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          padding: "32px 32px 0",
        }}
      >
        <span style={{ fontFamily: "var(--font-bebas)", fontSize: 22, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
          Braj Cricket Academy
        </span>
        <span style={{ fontFamily: "var(--font-dm)", fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
          © 2025 · All rights reserved
        </span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Programs", "Coaches", "Trials", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontFamily: "var(--font-dm)",
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                textDecoration: "none",
                letterSpacing: "0.05em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
