"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Orb {
  color: string;
  width: number;
  height: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  x?: string;
  duration: number;
  delay: number;
}

const darkOrbs: Orb[] = [
  // Gold — pushed high above the ball so it doesn't wash over it
  { color: "rgba(201,168,76,0.13)",  width: 1000, height: 400, top: "-30%", left: "50%", x: "-50%", duration: 9,  delay: 0   },
  // Maroon — left edge
  { color: "rgba(123,28,42,0.22)",   width: 700,  height: 600, top: "10%",  left: "-12%",            duration: 11, delay: 1.5 },
  // Navy — right edge
  { color: "rgba(0,45,98,0.28)",     width: 700,  height: 600, top: "5%",   right: "-12%",           duration: 13, delay: 3   },
  // Saffron — lower centre hint
  { color: "rgba(255,153,51,0.08)",  width: 600,  height: 400, bottom: "20%", left: "50%", x: "-50%", duration: 10, delay: 2  },
];

// Light mode: warm paper washes — no bright glows, just tonal warmth
const lightOrbs: Orb[] = [
  // Warm gold wash — high above, like morning sun on parchment (not on ball)
  { color: "rgba(197,160,89,0.14)",  width: 1000, height: 500, top: "-25%",  left: "50%", x: "-50%", duration: 12, delay: 0   },
  // Terracotta blush — left, like maroon leather in warm light
  { color: "rgba(170,80,60,0.09)",   width: 650,  height: 600, top: "5%",   left: "-10%",            duration: 14, delay: 2   },
  // Dusty ivory — right, adds air
  { color: "rgba(180,155,90,0.10)",  width: 650,  height: 550, top: "0%",   right: "-10%",           duration: 11, delay: 1   },
  // Warm amber pool — lower centre, grounds the page
  { color: "rgba(220,185,110,0.08)", width: 700,  height: 350, bottom: "15%", left: "50%", x: "-50%", duration: 13, delay: 3  },
];

function OrbLayer({ orbs }: { orbs: Orb[] }) {
  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.07, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: orb.width,
            height: orb.height,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            x: orb.x,
            borderRadius: "50%",
            background: `radial-gradient(ellipse at center, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(48px)",
          }}
        />
      ))}
    </>
  );
}

export default function GlowBG() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="dark"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <OrbLayer orbs={darkOrbs} />
          </motion.div>
        ) : (
          <motion.div
            key="light"
            style={{ position: "absolute", inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <OrbLayer orbs={lightOrbs} />

            {/* Light mode extras: grain texture + edge vignette */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
              backgroundRepeat: "repeat",
              opacity: 0.6,
              mixBlendMode: "multiply",
            }} />

            {/* Edge vignette — darkens corners slightly for premium paper feel */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(160,130,80,0.08) 100%)`,
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
