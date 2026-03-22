"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const CricketBall3D = dynamic(() => import("./CricketBall3D"), { ssr: false });

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Scroll animation: ball moves down and fades out
  const { scrollY } = useScroll();
  const ballY = useTransform(scrollY, [0, 800], [0, 400]);
  const ballOpacity = useTransform(scrollY, [0, 600, 1000], [1, 1, 0]);

  /* Hook to apply 'dark' class to html element globally */
  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

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
          className="mobile-theme-btn" 
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle dark mode"
          style={{ display: 'flex', alignItems: 'center', color: 'var(--dark)' }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

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
          <button 
            className="theme-toggle nav-link flex items-center justify-center text-[var(--dark)]" 
            onClick={() => setIsDark(!isDark)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px', color: 'var(--dark)' }}
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="#" className="nav-login">Login</a>
          <a href="#" className="nav-enroll">Enroll Now →</a>
        </div>
      </motion.nav>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close Button top right */}
            <button className="mobile-close-btn" onClick={() => setMenuOpen(false)}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <motion.div 
              className="mobile-menu-links"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              <a href="#programs" onClick={() => setMenuOpen(false)}>PROGRAMS</a>
              <a href="#coaches" onClick={() => setMenuOpen(false)}>COACHES</a>
              <a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
              <a href="#trials" onClick={() => setMenuOpen(false)}>TRIALS</a>
              <a href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a>
              <div className="mobile-menu-divider"></div>
              <div className="mobile-menu-ctas">
                <a href="#enroll" className="mobile-cta-enroll" onClick={() => setMenuOpen(false)}>ENROLL NOW</a>
                <a href="#login" className="mobile-cta-login" onClick={() => setMenuOpen(false)}>LOGIN</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

        {/* 3D Ball Layer */}
        <motion.div
          className="hero-ball-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          style={{ y: ballY, opacity: ballOpacity }}
        >
          <CricketBall3D isDark={isDark} />
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
