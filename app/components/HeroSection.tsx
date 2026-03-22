"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";

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
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Scroll animation: ball moves down and fades out
  const { scrollY } = useScroll();
  const ballY = useTransform(scrollY, [0, 800], [0, 400]);
  const ballOpacity = useTransform(scrollY, [0, 600, 1000], [1, 1, 0]);

  // Nav becomes glassy after scrolling 40px
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  // 3D tilt on mouse move
  const navRef = useRef<HTMLElement>(null);
  const rawX = useRef(0);
  const rawY = useRef(0);
  const rotateX = useSpring(0, { stiffness: 200, damping: 28 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 28 });

  const handleNavMouse = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    const r = navRef.current.getBoundingClientRect();
    rawX.current = ((e.clientX - r.left) / r.width - 0.5) * 6;
    rawY.current = ((e.clientY - r.top) / r.height - 0.5) * -4;
    rotateY.set(rawX.current);
    rotateX.set(rawY.current);
  };

  const handleNavLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

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
      {/* ── DESKTOP NAV (3D floating pill) ── */}
      <motion.nav
        ref={navRef as React.RefObject<HTMLElement>}
        className={`hero-nav desktop-nav ${scrolled ? "nav-scrolled" : ""}`}
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
        onMouseMove={handleNavMouse}
        onMouseLeave={handleNavLeave}
      >
        {/* Logo — left */}
        <a href="/" className="nav-logo">
          <span className="nav-logo-mark">B</span>
          <div className="nav-logo-text">
            <span className="nav-logo-name">BRAJ.</span>
            <span className="nav-logo-sub">Cricket Academy</span>
          </div>
        </a>

        {/* Links + actions — right */}
        <div className="nav-right">
          <div className="nav-links">
            {["Programs", "Coaches", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">
                {item}
                <span className="nav-link-line" />
              </a>
            ))}
          </div>
          <div className="nav-divider" />
          <button className="mobile-theme-btn" onClick={() => setIsDark(!isDark)} aria-label="Toggle theme">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="#" className="nav-enroll"><span>Enroll Now →</span></a>
        </div>
      </motion.nav>

      {/* ── MOBILE NAV (logo left · theme icon · hamburger right) ── */}
      <div className="mobile-nav">
        <a href="/" className="nav-logo">
          <span className="nav-logo-mark">B</span>
        </a>

        <div className="mob-nav-actions">
          {/* Standalone theme toggle — icon only, no text */}
          <motion.button
            className="mob-theme-icon-btn"
            onClick={() => setIsDark(!isDark)}
            whileTap={{ scale: 0.88 }}
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </motion.button>

          {/* Hamburger menu button */}
          <motion.button
            className="mob-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.92 }}
            aria-label="Open menu"
          >
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          </motion.button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mob-dropdown"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {["Programs", "Coaches", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="mob-link" onClick={() => setMenuOpen(false)}>
                {item}
              </a>
            ))}
            <div className="mob-dropdown-divider" />
            <div className="mob-dropdown-footer">
              <a href="#enroll" className="mob-enroll" onClick={() => setMenuOpen(false)}>
                Enroll Now →
              </a>
            </div>
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
