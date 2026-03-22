"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            background: "#0B0F1A",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          {/* Academy name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(56px, 12vw, 120px)",
              color: "#F4EFE4",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}
          >
            BRAJ.
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontFamily: "var(--font-fell)",
              fontSize: "clamp(10px, 2vw, 13px)",
              letterSpacing: "0.35em",
              color: "#C9A84C",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            Cricket Academy
          </motion.div>

          {/* Gold progress line */}
          <div style={{ marginTop: 40, width: 120, height: 1, background: "rgba(201,168,76,0.15)", position: "relative" }}>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--gold, #C9A84C)",
                transformOrigin: "left",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
