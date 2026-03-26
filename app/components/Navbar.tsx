"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

interface NavbarProps {
  isDark?: boolean;
  setIsDark?: (dark: boolean) => void;
}

export default function Navbar({ isDark: propIsDark, setIsDark: propSetIsDark }: NavbarProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [localIsDark, setLocalIsDark] = useState(true);
  const avatarRef = useRef<HTMLDivElement>(null);

  const isDark = propIsDark !== undefined ? propIsDark : localIsDark;

  const setIsDark = (dark: boolean) => {
    localStorage.setItem("braj-theme", dark ? "dark" : "light");
    if (propSetIsDark) propSetIsDark(dark);
    else setLocalIsDark(dark);
  };

  useEffect(() => {
    const saved = localStorage.getItem("braj-theme");
    if (saved !== null) {
      const dark = saved === "dark";
      if (propSetIsDark) propSetIsDark(dark);
      else setLocalIsDark(dark);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  const navRef = useRef<HTMLElement>(null);
  const rotateX = useSpring(0, { stiffness: 200, damping: 28 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 28 });

  const handleNavMouse = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    const r = navRef.current.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 6);
    rotateX.set(((e.clientY - r.top) / r.height - 0.5) * -4);
  };
  const handleNavLeave = () => { rotateX.set(0); rotateY.set(0); };

  const navLinks = [
    { name: "Programs", href: "/programs" },
    { name: "Coaches", href: "/#coaches" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/contact" },
  ];

  const user = session?.user;
  const isAdmin = user?.role === "admin";
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <>
      {/* ── Desktop Nav ── */}
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
                {link.name}<span className="nav-link-line" />
              </Link>
            ))}
          </div>
          <div className="nav-divider" />
          <button className="mobile-theme-btn" onClick={() => setIsDark(!isDark)} aria-label="Toggle theme">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Auth button */}
          {!user ? (
            <Link href="/login" className="nav-enroll"><span>Login →</span></Link>
          ) : (
            <div className="nav-avatar-wrap" ref={avatarRef}>
              <motion.button
                className="nav-avatar-btn"
                onClick={() => setAvatarOpen(!avatarOpen)}
                whileTap={{ scale: 0.93 }}
                title={user.name || ""}
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={initials} className="nav-avatar-img" />
                ) : (
                  <span className="nav-avatar-initials">{initials}</span>
                )}
                {isAdmin && <span className="nav-avatar-badge">A</span>}
              </motion.button>

              <AnimatePresence>
                {avatarOpen && (
                  <motion.div
                    className="nav-avatar-dropdown"
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="nav-avatar-info">
                      <span className="nav-avatar-name">{user.name}</span>
                      <span className="nav-avatar-email">{user.email}</span>
                      {isAdmin && <span className="nav-avatar-role-badge">Admin</span>}
                    </div>
                    <div className="nav-avatar-divider" />
                    {isAdmin && (
                      <Link href="/dashboard" className="nav-avatar-item" onClick={() => setAvatarOpen(false)}>
                        📊 Dashboard
                      </Link>
                    )}
                    <Link href="/profile" className="nav-avatar-item" onClick={() => setAvatarOpen(false)}>
                      👤 My Profile
                    </Link>
                    <div className="nav-avatar-divider" />
                    <button className="nav-avatar-item nav-avatar-logout"
                      onClick={() => { setAvatarOpen(false); signOut({ callbackUrl: "/" }); }}>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!user && <Link href="/enroll" className="nav-enroll" style={{ marginLeft: 6 }}><span>Enroll Now →</span></Link>}
        </div>
      </motion.nav>

      {/* ── Mobile Nav ── */}
      <div className="mobile-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Link href="/" className="nav-logo">
          <span className="nav-logo-mark">B</span>
        </Link>
        <div className="mob-nav-actions">
          <motion.button className="mob-theme-icon-btn" onClick={() => setIsDark(!isDark)} whileTap={{ scale: 0.88 }} aria-label="Toggle theme">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </motion.button>
          <motion.button className="mob-menu-btn" onClick={() => setMenuOpen(!menuOpen)} whileTap={{ scale: 0.92 }} aria-label="Open menu">
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
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

            {user && (
              <>
                <div className="mob-dropdown-divider" />
                {isAdmin && (
                  <Link href="/dashboard" className="mob-link" onClick={() => setMenuOpen(false)}>📊 Dashboard</Link>
                )}
                <Link href="/profile" className="mob-link" onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
              </>
            )}

            <div className="mob-dropdown-divider" />
            <div className="mob-dropdown-footer">
              {!user ? (
                <>
                  <Link href="/login" className="mob-enroll" style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.35)", color: "var(--gold)" }} onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/enroll" className="mob-enroll" onClick={() => setMenuOpen(false)}>
                    Enroll Now →
                  </Link>
                </>
              ) : (
                <button className="mob-enroll"
                  style={{ background: "rgba(224,92,92,0.12)", border: "1px solid rgba(224,92,92,0.3)", color: "#e05c5c", cursor: "pointer", width: "100%" }}
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}>
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ── Avatar button ── */
        .nav-avatar-wrap { position: relative; }
        .nav-avatar-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(197,160,89,0.18);
          border: 1.5px solid rgba(197,160,89,0.45);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          position: relative;
          overflow: visible;
          transition: border-color 0.2s;
        }
        .nav-avatar-btn:hover { border-color: var(--gold); }
        .nav-avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .nav-avatar-initials {
          font-family: var(--font-bebas), serif;
          font-size: 14px;
          color: var(--gold);
          letter-spacing: 0.04em;
        }
        .nav-avatar-badge {
          position: absolute;
          top: -4px; right: -4px;
          width: 14px; height: 14px;
          background: var(--gold);
          border-radius: 50%;
          font-family: var(--font-dm), sans-serif;
          font-size: 8px;
          font-weight: 700;
          color: #0D1117;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid var(--page-bg);
        }

        /* ── Avatar dropdown ── */
        .nav-avatar-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          min-width: 210px;
          background: #161b26;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 16px;
          padding: 6px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.45);
          z-index: 200;
        }
        html:not(.dark) .nav-avatar-dropdown {
          background: #fff;
          border-color: rgba(201,168,76,0.25);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        .nav-avatar-info {
          padding: 10px 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .nav-avatar-name {
          font-family: var(--font-dm), sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: var(--dark);
        }
        .nav-avatar-email {
          font-family: var(--font-dm), sans-serif;
          font-size: 11px;
          color: var(--dark);
          opacity: 0.45;
        }
        .nav-avatar-role-badge {
          margin-top: 4px;
          display: inline-block;
          background: rgba(197,160,89,0.15);
          border: 1px solid rgba(197,160,89,0.3);
          border-radius: 20px;
          padding: 2px 8px;
          font-family: var(--font-dm), sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          width: fit-content;
        }
        .nav-avatar-divider {
          height: 1px;
          background: rgba(201,168,76,0.12);
          margin: 4px 0;
        }
        .nav-avatar-item {
          display: block;
          width: 100%;
          padding: 9px 12px;
          border-radius: 10px;
          font-family: var(--font-dm), sans-serif;
          font-size: 13px;
          color: var(--dark);
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s;
          box-sizing: border-box;
        }
        .nav-avatar-item:hover { background: rgba(201,168,76,0.1); }
        .nav-avatar-logout { color: #e05c5c !important; }
        .nav-avatar-logout:hover { background: rgba(224,92,92,0.1) !important; }
      `}</style>
    </>
  );
}
