"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Cursor from "../components/Cursor";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const GALLERY = [
  { id: 1, cat: "Training",     title: "Morning Nets Session",     img: "https://picsum.photos/seed/nets1/600/420",   tall: false },
  { id: 2, cat: "Matches",      title: "State Championship Final",  img: "https://picsum.photos/seed/match2/600/720",  tall: true  },
  { id: 3, cat: "Achievements", title: "Ranji Selection Ceremony",  img: "https://picsum.photos/seed/award3/600/420",  tall: false },
  { id: 4, cat: "Training",     title: "Video Analysis Lab",        img: "https://picsum.photos/seed/tech4/600/420",   tall: false },
  { id: 5, cat: "Matches",      title: "District League Match",     img: "https://picsum.photos/seed/game5/600/720",   tall: true  },
  { id: 6, cat: "Training",     title: "Strength & Conditioning",   img: "https://picsum.photos/seed/gym6/600/420",    tall: false },
  { id: 7, cat: "Events",       title: "Annual Day 2024",           img: "https://picsum.photos/seed/event7/600/420",  tall: false },
  { id: 8, cat: "Achievements", title: "Best Academy Award",        img: "https://picsum.photos/seed/trophy8/600/420", tall: false },
];

const CATS = ["All", "Training", "Matches", "Events", "Achievements"] as const;
type Cat = typeof CATS[number];

const TIMELINE = [
  { year: "2009",  title: "Founding",           desc: "The academy opened its gates with a vision for elite cricket development in Mathura." },
  { year: "2012",  title: "First Ranji Player",  desc: "A milestone as our first student debuted at the first-class Ranji Trophy level." },
  { year: "2015",  title: "New Facilities",      desc: "Four indoor nets, a fully equipped gym, and a video analysis room inaugurated." },
  { year: "2018",  title: "State Champions",     desc: "Our U-19 squad secured the academy's first major state-level silverware." },
  { year: "2021",  title: "Digital Coaching",    desc: "Launched AI-powered video analysis and remote coaching modules." },
  { year: "Today", title: "Legacy Continues",    desc: "Serving 200+ active students with cutting-edge global methodologies." },
];

const FACILITIES = [
  { title: "World-class Turf",         label: "Premium Ground", wide: true,  img: "https://picsum.photos/seed/ground10/1200/600" },
  { title: "Practice Nets",            label: "Technique",      wide: false, img: "https://picsum.photos/seed/nets11/600/600"   },
  { title: "The Elite Gym",            label: "Power",          wide: false, img: "https://picsum.photos/seed/gym12/600/600"    },
  { title: "Frame-by-frame Precision", label: "Analytics",      wide: true,  img: "https://picsum.photos/seed/tech13/1200/600"  },
];

const LEADERSHIP = [
  { name: "Ramesh Kumar",  role: "Director & Head Coach",  img: "https://picsum.photos/seed/person1/400/533" },
  { name: "Ananya Sharma", role: "Head of Performance",    img: "https://picsum.photos/seed/person2/400/533" },
  { name: "Rajat Mehra",   role: "Technical Advisor",      img: "https://picsum.photos/seed/person3/400/533" },
  { name: "Sana Khan",     role: "Operations Lead",        img: "https://picsum.photos/seed/person4/400/533" },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [activeCat, setActiveCat] = useState<Cat>("All");
  const [lightbox, setLightbox] = useState<typeof GALLERY[0] | null>(null);

  const filtered = activeCat === "All" ? GALLERY : GALLERY.filter(g => g.cat === activeCat);

  return (
    <div style={{ background: "#10141a", minHeight: "100vh", color: "#e5e2d8" }}>
      <Cursor />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="ab-hero">
        <img src="https://picsum.photos/seed/stadium99/1920/1080" alt="Cricket ground" className="ab-hero-img" />
        <div className="ab-hero-overlay" />
        <div className="ab-hero-content">
          <motion.span className="ab-eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            Established 2009
          </motion.span>
          <motion.h1 className="ab-hero-h1" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9, ease: [0.22,1,0.36,1] }}>
            The Heritage of<br />
            <em style={{ color: "#C5A059", fontStyle: "italic" }}>Excellence</em>
          </motion.h1>
          <motion.p className="ab-hero-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
            Sculpting legends since 2009. We don't just teach cricket; we refine the soul of the game through discipline, precision, and passion.
          </motion.p>
        </div>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────────────────── */}
      <section className="ab-section" style={{ background: "#161b23" }}>
        <div className="ab-container ab-story-grid">
          <div>
            <h2 className="ab-section-h2">Refining the Soul<br />of Cricket</h2>
            <div className="ab-story-body">
              <p>Founded in 2009, Braj Cricket Academy was born from a singular vision: to create a sanctuary for pure technique in an era of rapid transformation. We believe that true mastery lies in the intersection of traditional wisdom and modern scientific analysis.</p>
              <p style={{ marginTop: 20 }}>Our philosophy transcends the boundaries of the pitch. We cultivate leaders, strategic thinkers, and athletes who understand the profound silence before a delivery and the thunder of a well-timed strike.</p>
            </div>
          </div>
          <div className="ab-story-photos">
            <div className="ab-story-photo ab-photo-top">
              <img src="https://picsum.photos/seed/cricket1/600/800" alt="Cricket training" className="ab-story-photo-img" />
              <div className="ab-story-photo-overlay" />
            </div>
            <div className="ab-story-photo ab-photo-bot">
              <img src="https://picsum.photos/seed/cricket2/600/800" alt="Cricket pitch" className="ab-story-photo-img" />
              <div className="ab-story-photo-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────────────── */}
      <section className="ab-section" style={{ background: "#0a0e14", overflow: "hidden" }}>
        <div className="ab-container" style={{ paddingBottom: 0 }}>
          <h2 className="ab-section-h2" style={{ marginBottom: 6 }}>Our Journey</h2>
          <div style={{ width: 64, height: 1, background: "#C5A059" }} />
        </div>
        <div className="ab-timeline-wrap">
          <div className="ab-timeline-line" />
          {TIMELINE.map((m, i) => (
            <motion.div key={m.year} className="ab-tl-item"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
              <div className="ab-tl-year">{m.year}</div>
              <div className="ab-tl-dot" />
              <div className="ab-tl-title">{m.title}</div>
              <p className="ab-tl-desc">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FACILITIES BENTO ─────────────────────────────────────────────── */}
      <section className="ab-section" style={{ background: "#161b23" }}>
        <div className="ab-container" style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 className="ab-section-h2" style={{ fontStyle: "italic" }}>World Class Grounds</h2>
          <p style={{ fontFamily: "var(--font-dm,sans-serif)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(229,226,216,0.35)", marginTop: 8 }}>Curated facilities for elite performance</p>
        </div>
        <div className="ab-container">
          <div className="ab-bento">
            {FACILITIES.map((f, i) => (
              <motion.div key={f.title} className={`ab-bento-item${f.wide ? " ab-bento-wide" : ""}`}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                <img src={f.img} alt={f.title} className="ab-bento-photo" />
                <div className="ab-bento-dim" />
                <div className="ab-bento-overlay">
                  <span className="ab-bento-label">{f.label}</span>
                  <div className="ab-bento-cap">{f.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ─────────────────────────────────────────────────── */}
      <section style={{ background: "#0a0e14", borderTop: "1px solid rgba(78,70,57,0.15)", borderBottom: "1px solid rgba(78,70,57,0.15)", padding: "80px 5%" }}>
        <div className="ab-stats-row">
          {[["40+","Ranji Players"],["15+","State Trophies"],["200+","Alumni Trained"]].map(([v,l]) => (
            <motion.div key={l} className="ab-stat"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="ab-stat-val">{v}</span>
              <span className="ab-stat-label">{l}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
      <section className="ab-section" style={{ background: "#161b23" }}>
        <div className="ab-container">
          <div className="ab-gallery-header">
            <div>
              <h2 className="ab-section-h2" style={{ marginBottom: 6 }}>Gallery</h2>
              <p style={{ fontFamily: "var(--font-dm,sans-serif)", fontSize: 13, color: "rgba(229,226,216,0.4)" }}>The Visual Archive of Braj Cricket</p>
            </div>
            <div className="ab-filter-bar">
              {CATS.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)} className={`ab-filter-btn${activeCat === cat ? " ab-filter-active" : ""}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeCat} className="ab-masonry"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {filtered.map((item, i) => (
                <motion.div key={item.id} className={`ab-gallery-item${item.tall ? " ab-gallery-tall" : ""}`}
                  onClick={() => setLightbox(item)}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}>
                  <img src={item.img} alt={item.title} className="ab-gal-img" />
                  <div className="ab-gal-hover">
                    <div className="ab-gal-title">{item.title}</div>
                    <div className="ab-gal-cat">{item.cat}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── LEADERSHIP ───────────────────────────────────────────────────── */}
      <section className="ab-section" style={{ background: "#0f131a" }}>
        <div className="ab-container">
          <div style={{ marginBottom: 64 }}>
            <h2 className="ab-section-h2" style={{ fontStyle: "italic", marginBottom: 8 }}>Leadership</h2>
            <div style={{ width: 48, height: 1, background: "#C5A059" }} />
          </div>
          <div className="ab-leaders-grid">
            {LEADERSHIP.map((l, i) => (
              <motion.div key={l.name} className="ab-leader-card"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}>
                <div className="ab-leader-photo">
                  <img src={l.img} alt={l.name} className="ab-leader-img" />
                  <div className="ab-leader-dim" />
                </div>
                <div style={{ padding: "16px 0 0" }}>
                  <div className="ab-leader-name">{l.name}</div>
                  <div className="ab-leader-role">{l.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="ab-footer">
        <div>
          <div className="ab-footer-brand">Braj Cricket Academy</div>
          <p className="ab-footer-copy">© 2024 Braj Cricket Academy. All rights reserved.</p>
        </div>
        <div className="ab-footer-links">
          {["Privacy","Terms","Contact","Socials"].map(l => (
            <Link key={l} href="#" className="ab-footer-link">{l}</Link>
          ))}
        </div>
      </footer>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="ab-lightbox-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}>
            <motion.div className="ab-lightbox-card"
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}>
              <img src={lightbox.img} alt={lightbox.title} style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: 4, display: "block" }} />
              <div style={{ padding: "24px 0 0" }}>
                <div className="ab-lb-title">{lightbox.title}</div>
                <div className="ab-lb-cat">{lightbox.cat}</div>
                <button className="ab-lb-close" onClick={() => setLightbox(null)}>Close ×</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ─ Base ─ */
        .ab-container { max-width: 1120px; margin: 0 auto; padding: 0 5%; }
        .ab-section { padding: 96px 0; }
        .ab-section-h2 {
          font-family: var(--font-bebas,'Noto Serif',serif);
          font-size: clamp(32px,5vw,52px); color: #e5e2d8;
          line-height: 1.1; margin: 0 0 20px; letter-spacing: 0.01em;
        }

        /* ─ Hero ─ */
        .ab-hero { position:relative; height:100vh; min-height:600px; display:flex; align-items:center; overflow:hidden; }
        .ab-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(0.45) contrast(1.1); }
        .ab-hero-overlay {
          position:absolute; inset:0;
          background: linear-gradient(to right, rgba(10,14,20,0.9) 0%, rgba(10,14,20,0.5) 55%, transparent 100%);
        }
        .ab-hero-content { position:relative; z-index:2; padding:0 5%; max-width:680px; }
        .ab-eyebrow { font-family:var(--font-dm,sans-serif); font-size:11px; letter-spacing:0.35em; text-transform:uppercase; color:#C5A059; display:block; margin-bottom:20px; }
        .ab-hero-h1 { font-family:var(--font-bebas,'Noto Serif',serif); font-size:clamp(56px,11vw,120px); color:#e5e2d8; line-height:1.05; margin:0 0 24px; letter-spacing:-0.01em; }
        .ab-hero-p { font-family:var(--font-dm,sans-serif); font-size:clamp(14px,1.8vw,17px); color:rgba(229,226,216,0.55); max-width:460px; line-height:1.75; }

        /* ─ Story ─ */
        .ab-story-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:center; }
        @media(max-width:768px){ .ab-story-grid{ grid-template-columns:1fr; gap:40px; } }
        .ab-story-body { font-family:var(--font-dm,sans-serif); font-size:15px; line-height:1.8; color:rgba(229,226,216,0.55); margin-top:24px; }
        .ab-story-photos { display:grid; grid-template-columns:1fr 1fr; gap:16px; height:560px; }
        @media(max-width:640px){ .ab-story-photos{ height:260px; } }
        .ab-story-photo { position:relative; overflow:hidden; filter:grayscale(0.65) brightness(0.75); transition:filter 0.7s cubic-bezier(0.22,1,0.36,1); cursor:pointer; }
        .ab-story-photo:hover { filter:grayscale(0) brightness(1); }
        .ab-photo-top { margin-top:40px; }
        .ab-photo-bot { margin-bottom:40px; }
        .ab-story-photo-img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .ab-story-photo:hover .ab-story-photo-img { transform:scale(1.05); }
        .ab-story-photo-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.18); }

        /* ─ Timeline ─ */
        .ab-timeline-wrap { display:flex; overflow-x:auto; padding:48px 5% 56px; gap:0; position:relative; scrollbar-width:none; }
        .ab-timeline-wrap::-webkit-scrollbar{ display:none; }
        .ab-timeline-line { position:absolute; top:50%; left:0; width:100%; height:1px; background:rgba(78,70,57,0.3); transform:translateY(-50%); }
        .ab-tl-item { min-width:260px; position:relative; z-index:1; padding-right:56px; flex-shrink:0; cursor:default; }
        .ab-tl-year { font-family:var(--font-bebas,serif); font-size:44px; color:rgba(229,226,216,0.2); margin-bottom:28px; line-height:1; transition:color 0.5s; }
        .ab-tl-item:hover .ab-tl-year { color:#C5A059; }
        .ab-tl-dot { width:14px; height:14px; border-radius:50%; background:#C5A059; border:3px solid #0a0e14; box-shadow:0 0 18px rgba(197,160,89,0.5); margin-bottom:20px; }
        .ab-tl-title { font-family:var(--font-bebas,serif); font-size:19px; color:#e5e2d8; margin-bottom:8px; }
        .ab-tl-desc { font-family:var(--font-dm,sans-serif); font-size:12.5px; color:rgba(229,226,216,0.4); line-height:1.7; max-width:200px; margin:0; }

        /* ─ Bento ─ */
        .ab-bento { display:grid; grid-template-columns:repeat(12,1fr); grid-auto-rows:360px; gap:12px; }
        @media(max-width:900px){ .ab-bento{ grid-template-columns:1fr 1fr; grid-auto-rows:240px; } }
        @media(max-width:520px){ .ab-bento{ grid-template-columns:1fr; grid-auto-rows:220px; } }
        .ab-bento-item { grid-column:span 4; position:relative; overflow:hidden; cursor:pointer; }
        .ab-bento-wide { grid-column:span 8; }
        @media(max-width:900px){ .ab-bento-item,.ab-bento-wide{ grid-column:auto; } }
        .ab-bento-photo { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:transform 1s cubic-bezier(0.22,1,0.36,1); }
        .ab-bento-item:hover .ab-bento-photo { transform:scale(1.08); }
        .ab-bento-dim { position:absolute; inset:0; background:rgba(0,0,0,0.4); transition:background 0.4s; }
        .ab-bento-item:hover .ab-bento-dim { background:rgba(0,0,0,0.15); }
        .ab-bento-overlay { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end; padding:28px; background:linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 50%); opacity:0; transition:opacity 0.4s; }
        .ab-bento-item:hover .ab-bento-overlay { opacity:1; }
        .ab-bento-label { font-family:var(--font-dm,sans-serif); font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#C5A059; margin-bottom:6px; }
        .ab-bento-cap { font-family:var(--font-bebas,serif); font-size:22px; color:#fff; letter-spacing:0.03em; }

        /* ─ Stats ─ */
        .ab-stats-row { display:flex; justify-content:center; gap:80px; flex-wrap:wrap; max-width:700px; margin:0 auto; text-align:center; }
        @media(max-width:540px){ .ab-stats-row{ gap:40px; } }
        .ab-stat-val { display:block; font-family:var(--font-bebas,serif); font-size:clamp(52px,8vw,80px); color:#C5A059; line-height:1; }
        .ab-stat-label { font-family:var(--font-dm,sans-serif); font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(229,226,216,0.35); display:block; margin-top:6px; }

        /* ─ Gallery ─ */
        .ab-gallery-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:40px; flex-wrap:wrap; gap:20px; }
        .ab-filter-bar { display:flex; gap:24px; flex-wrap:wrap; }
        .ab-filter-btn { font-family:var(--font-dm,sans-serif); font-size:11px; letter-spacing:0.2em; text-transform:uppercase; background:none; border:none; cursor:pointer; color:rgba(154,143,128,0.7); padding:0 0 4px; border-bottom:1px solid transparent; transition:color 0.2s; }
        .ab-filter-btn:hover { color:#e5e2d8; }
        .ab-filter-active { color:#C5A059 !important; border-bottom-color:#C5A059 !important; }
        .ab-masonry { columns:3; column-gap:12px; }
        @media(max-width:768px){ .ab-masonry{ columns:2; } }
        @media(max-width:480px){ .ab-masonry{ columns:1; } }
        .ab-gallery-item { break-inside:avoid; margin-bottom:12px; position:relative; overflow:hidden; cursor:pointer; }
        .ab-gallery-tall { /* tall items are naturally taller via their img */ }
        .ab-gal-img { width:100%; display:block; transition:transform 0.6s cubic-bezier(0.22,1,0.36,1); filter:grayscale(0.2); }
        .ab-gallery-item:hover .ab-gal-img { transform:scale(1.05); filter:grayscale(0); }
        .ab-gal-hover { position:absolute; inset:0; display:flex; flex-direction:column; align-items:flex-start; justify-content:flex-end; padding:20px; background:linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 55%); opacity:0; transition:opacity 0.3s; }
        .ab-gallery-item:hover .ab-gal-hover { opacity:1; }
        .ab-gal-title { font-family:var(--font-bebas,serif); font-size:16px; color:#fff; letter-spacing:0.04em; }
        .ab-gal-cat { font-family:var(--font-dm,sans-serif); font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:#C5A059; margin-top:3px; }

        /* ─ Leadership ─ */
        .ab-leaders-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:28px; }
        @media(max-width:900px){ .ab-leaders-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px){ .ab-leaders-grid{ grid-template-columns:1fr 1fr; gap:16px; } }
        .ab-leader-card { cursor:pointer; }
        .ab-leader-photo { aspect-ratio:3/4; overflow:hidden; position:relative; }
        .ab-leader-img { width:100%; height:100%; object-fit:cover; display:block; filter:grayscale(0.8) brightness(0.75); transition:filter 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s; }
        .ab-leader-card:hover .ab-leader-img { filter:grayscale(0) brightness(1); transform:scale(1.04); }
        .ab-leader-dim { position:absolute; inset:0; background:rgba(0,0,0,0.12); }
        .ab-leader-name { font-family:var(--font-bebas,serif); font-size:22px; color:#e5e2d8; margin-bottom:4px; letter-spacing:0.02em; transition:color 0.3s; }
        .ab-leader-card:hover .ab-leader-name { color:#C5A059; }
        .ab-leader-role { font-family:var(--font-dm,sans-serif); font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(154,143,128,0.75); }

        /* ─ Footer ─ */
        .ab-footer { background:#0a0e14; border-top:1px solid rgba(78,70,57,0.15); display:flex; justify-content:space-between; align-items:center; padding:40px 5%; flex-wrap:wrap; gap:20px; }
        .ab-footer-brand { font-family:var(--font-bebas,serif); font-size:20px; color:#e5e2d8; margin-bottom:6px; }
        .ab-footer-copy { font-family:var(--font-dm,sans-serif); font-size:10px; letter-spacing:0.1em; color:rgba(154,143,128,0.6); text-transform:uppercase; }
        .ab-footer-links { display:flex; gap:28px; flex-wrap:wrap; }
        .ab-footer-link { font-family:var(--font-dm,sans-serif); font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(154,143,128,0.6); text-decoration:none; transition:color 0.2s; }
        .ab-footer-link:hover { color:#C5A059; }

        /* ─ Lightbox ─ */
        .ab-lightbox-bg { position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; }
        .ab-lightbox-card { background:#161b23; border:1px solid rgba(197,160,89,0.2); border-radius:4px; max-width:480px; width:100%; overflow:hidden; }
        .ab-lb-title { font-family:var(--font-bebas,serif); font-size:26px; color:#e5e2d8; }
        .ab-lb-cat { font-family:var(--font-dm,sans-serif); font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#C5A059; margin-top:6px; }
        .ab-lb-close { margin-top:20px; margin-bottom:4px; padding:10px 32px; background:transparent; border:1px solid rgba(197,160,89,0.3); color:#C5A059; border-radius:999px; font-family:var(--font-dm,sans-serif); font-size:12px; letter-spacing:0.1em; cursor:pointer; transition:background 0.2s; display:block; }
        .ab-lb-close:hover { background:rgba(197,160,89,0.1); }
        .ab-lightbox-card > div:last-child { padding:0 28px 28px; }
      `}</style>
    </div>
  );
}
