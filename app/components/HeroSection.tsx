"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";

const CricketBall3D = dynamic(() => import("./CricketBall3D"), { ssr: false });

import Navbar from "./Navbar";

export default function HeroSection() {
  const [isDark, setIsDark] = useState(true);
  const [dropReady, setDropReady] = useState(false);

  // Sync with persisted theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("braj-theme");
    if (saved !== null) setIsDark(saved === "dark");
  }, []);

  // Trigger drop animation only after client hydration (so dynamic import has time to resolve)
  useEffect(() => {
    const t = setTimeout(() => setDropReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Scroll animation: ball moves down and fades out
  const { scrollY } = useScroll();
  const ballY = useTransform(scrollY, [0, 800], [0, 400]);
  const ballOpacity = useTransform(scrollY, [0, 600, 1000], [1, 1, 0]);

  // Stagger variants array for features
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.8 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <section className="hero-section">
      <Navbar isDark={isDark} setIsDark={setIsDark} />

      {/* HERO CONTENT */}
      <div className="hero-content">
        {/* GIANT TITLE (Solid Background Layer) */}
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <span className="hero-title-main">BRAJ.</span>
          <div className="hero-title-sub-row">
            <span className="hero-title-sub">Cricket</span>
            <div className="title-ball-spacer"></div>
            <span className="hero-title-sub">Academy</span>
          </div>
        </motion.h1>

        {/* 3D Ball Layer — drop from above into rest position */}
        {/* Outer: entry bounce (transforms visual position only, CSS layout unaffected) */}
        <motion.div
          initial={{ y: -480, opacity: 0 }}
          animate={dropReady ? { y: 0, opacity: 1 } : { y: -480, opacity: 0 }}
          transition={{
            y: { type: "spring", stiffness: 32, damping: 8, mass: 2.2, delay: 0.1 },
            opacity: { duration: 0.2, ease: "easeOut", delay: 0.1 },
          }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}
        >
          {/* Inner: CSS positions ball correctly + scroll parallax */}
          <motion.div
            className="hero-ball-wrap"
            style={{ y: ballY, opacity: ballOpacity, position: "absolute" }}
          >
            <CricketBall3D isDark={isDark} />
          </motion.div>
        </motion.div>

        {/* GIANT TITLE (Outlined Foreground Layer) */}
        <motion.h1
          className="hero-title hero-title-front"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          aria-hidden="true"
        >
          <span className="hero-title-main outline-text">BRAJ.</span>
          <div className="hero-title-sub-row" style={{ visibility: 'hidden' }}>
            <span className="hero-title-sub">Cricket</span>
            <div className="title-ball-spacer"></div>
            <span className="hero-title-sub">Academy</span>
          </div>
        </motion.h1>

        {/* Features — right */}
        <motion.div 
          className="hero-features"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {[
            ["Expert Coaching", "01"],
            ["Performance Tracking", "02"],
            ["Video Analysis", "03"],
          ].map(([label, num]) => (
            <motion.div key={num} className="hero-feature-item" variants={itemVariants}>
              <span className="hero-feature-label">{label}</span>
              <span className="hero-feature-num">/{num}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Left info */}
        <motion.div 
          className="hero-left-info"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <div className="hero-avatars-row">
            <div className="hero-avatars">
              {[
                { i: "RK", bg: "var(--gold)" },
                { i: "AS", bg: "var(--navy)" },
                { i: "PM", bg: "var(--maroon)" },
              ].map((coach, idx) => (
                <div
                  key={idx}
                  className="hero-avatar"
                  style={{
                    background: coach.bg,
                    marginLeft: idx > 0 ? -10 : 0,
                    color: "#fff",
                  }}
                >
                  {coach.i}
                </div>
              ))}
            </div>
            <div className="hero-stat-inline">
              <span className="hero-stat-num">500+</span>
              <span className="hero-stat-label">Trained athletes</span>
            </div>
          </div>
          <p className="heritage-label">Est. 2009 · Braj Cricket Academy</p>
          <p className="hero-tagline-text">
            Trained in the tradition<br />
            of India&apos;s Test match greats —<br />
            coaching excellence since 2009.
          </p>
          <div className="hero-dots">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="hero-dot" />
            ))}
          </div>
        </motion.div>

        {/* CTA circle */}
        <motion.div 
          className="hero-right-cta"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.1, type: "spring" as const }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button className="watch-btn">
            <span className="watch-btn-arrow">▶</span>
            <span className="watch-btn-text">How it works?</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
