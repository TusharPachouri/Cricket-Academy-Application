"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

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

interface NavbarProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

export default function Navbar({ isDark: propIsDark, setIsDark: propSetIsDark }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localIsDark, setLocalIsDark] = useState(true);

  const isDark = propIsDark !== undefined ? propIsDark : localIsDark;

  // Persist theme to localStorage and propagate to parent if needed
  const setIsDark = (dark: boolean) => {
    localStorage.setItem("braj-theme", dark ? "dark" : "light");
    if (propSetIsDark) propSetIsDark(dark);
    else setLocalIsDark(dark);
  };

  // On mount: read saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("braj-theme");
    if (saved !== null) {
      const dark = saved === "dark";
      if (propSetIsDark) propSetIsDark(dark);
      else setLocalIsDark(dark);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const navRef = useRef<HTMLElement>(null);
  const rotateX = useSpring(0, { stiffness: 200, damping: 28 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 28 });

  const handleNavMouse = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    const r = navRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - r.left) / r.width - 0.5) * 6;
    const rawY = ((e.clientY - r.top) / r.height - 0.5) * -4;
    rotateY.set(rawX);
    rotateX.set(rawY);
  };

  const handleNavLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const navLinks = [
    { name: "Programs", href: "/programs" },
    { name: "Coaches", href: "/#coaches" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      <motion.nav
        ref={navRef}
        className={`hero-nav desktop-nav ${scrolled ? "nav-scrolled" : ""}`}
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800, position: "fixed", top: 0, left: 0, right: 0 }}
        onMouseMove={handleNavMouse}
        onMouseLeave={handleNavLeave}
      >
        <Link href="/" className="nav-logo">
          <span className="nav-logo-mark">B</span>
          <div className="nav-logo-text">
            <span className="nav-logo-name">BRAJ.</span>
            <span className="nav-logo-sub">Cricket Academy</span>
          </div>
        </Link>

        <div className="nav-right">
          <div className="nav-links">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="nav-link">
                {link.name}
                <span className="nav-link-line" />
              </Link>
            ))}
          </div>
          <div className="nav-divider" />
          <button className="mobile-theme-btn" onClick={() => setIsDark(!isDark)} aria-label="Toggle theme">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href="#enroll" className="nav-enroll"><span>Enroll Now →</span></Link>
        </div>
      </motion.nav>

      <div className="mobile-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Link href="/" className="nav-logo">
          <span className="nav-logo-mark">B</span>
        </Link>

        <div className="mob-nav-actions">
          <motion.button
            className="mob-theme-icon-btn"
            onClick={() => setIsDark(!isDark)}
            whileTap={{ scale: 0.88 }}
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </motion.button>

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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mob-dropdown"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="mob-link" onClick={() => setMenuOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className="mob-dropdown-divider" />
            <div className="mob-dropdown-footer">
              <Link href="#enroll" className="mob-enroll" onClick={() => setMenuOpen(false)}>
                Enroll Now →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
