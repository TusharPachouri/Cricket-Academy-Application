"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const CricketBall3D = dynamic(() => import("./CricketBall3D"), { ssr: false });

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* NAV */}
      <motion.nav 
        className="hero-nav"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="nav-pill">
          {["Programs", "Coaches", "About", "Trials", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
              {item}
            </a>
          ))}
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
        </button>

        <div className="nav-right">
          <a href="#" className="nav-login">Login</a>
          <a href="#" className="nav-enroll">Enroll Now →</a>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        {["Programs", "Coaches", "About", "Trials", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="mobile-menu-link"
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
        <div className="mobile-menu-actions">
          <a href="#" className="nav-login">Login</a>
          <a href="#" className="nav-enroll">Enroll Now →</a>
        </div>
      </div>

      {/* HERO CONTENT */}
      <div className="hero-content">
        {/* GIANT TITLE */}
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <span style={{ display: "block", fontSize: "clamp(70px, 12vw, 200px)", letterSpacing: "0.04em" }}>
            BRAJ
          </span>
          <span style={{
            display: "block",
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(18px, 3vw, 48px)",
            letterSpacing: "0.28em",
            color: "var(--gold)",
            lineHeight: 1.6,
          }}>
            Cricket Academy
          </span>
        </motion.h1>

        {/* 3D Ball */}
        <motion.div
          className="hero-ball-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
        >
          <CricketBall3D />
        </motion.div>

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
