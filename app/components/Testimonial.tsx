"use client";
import { motion } from "framer-motion";

export default function Testimonial() {
  return (
    <section
      style={{
        background: "var(--cream)",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      }}
      className="w-full py-28 px-8 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative">
        {/* Giant decorative quote mark */}
        <motion.div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(120px, 18vw, 220px)",
            color: "var(--gold)",
            lineHeight: 0.8,
            position: "absolute",
            top: -40,
            left: -20,
            userSelect: "none",
            pointerEvents: "none",
          }}
          initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
          whileInView={{ scale: 1, opacity: 0.9, rotate: 0 }}
          transition={{ type: "spring" as const, stiffness: 60, damping: 15, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          &ldquo;
        </motion.div>

        <motion.div
          style={{ paddingTop: 80, paddingLeft: 20 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <blockquote style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(20px, 3.5vw, 32px)",
            fontStyle: "italic",
            color: "var(--dark)",
            lineHeight: 1.55,
            marginBottom: 32,
          }}>
            Braj Cricket Academy didn&apos;t just teach me how to bat — they taught me how to think on the field. That&apos;s the difference between good players and great ones. I owe everything to the coaches here.
          </blockquote>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--navy)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--gold)",
            }}>
              <span style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 16, color: "var(--gold)" }}>VK</span>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-barlow)", fontWeight: 600, fontSize: 15, color: "var(--dark)", letterSpacing: "0.05em" }}>
                Vikas Kapoor
              </div>
              <div style={{ fontFamily: "var(--font-fell)", fontSize: 11, color: "var(--gold)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                State U-19 Captain, 2023
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
