"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Cursor from "../components/Cursor";
import CTAFooter from "../components/CTAFooter";
import SectionFrame from "../components/SectionFrame";

/* ── Main featured tournament ────────────────────────────── */
const mainTournament = {
  season: "Season 2025",
  name: "Braj Cricket Academy League",
  short: "BCAL",
  status: "Registrations Open",
  statusColor: "#4caf81",
  format: "T20 · Auction-Based Teams",
  dates: "June – August 2025",
  venue: "Braj Cricket Academy Ground, Mathura",
  registrationFee: 1500,
  prizes: [
    { icon: "🏆", title: "Best Batsman", value: "₹5,100 + Trophy", color: "#C9A84C" },
    { icon: "🏏", title: "Best Bowler", value: "₹3,100 + Trophy", color: "#C9A84C" },
    { icon: "⚡", title: "Best Fielder", value: "₹2,100 + Trophy", color: "#C9A84C" },
    { icon: "🌟", title: "Player of the Match", value: "Trophy — Every Match", color: "#C9A84C" },
    { icon: "4️⃣", title: "Highest Fours", value: "Special Award 🏆", color: "#C9A84C" },
    { icon: "6️⃣", title: "Highest Sixes", value: "Special Award 🏆", color: "#C9A84C" },
    { icon: "🤝", title: "Most Catches", value: "Special Award 🏆", color: "#C9A84C" },
    { icon: "🎯", title: "Most Wickets", value: "Special Award 🏆", color: "#C9A84C" },
  ],
  perks: [
    { icon: "👕", label: "Full Colour Dress", desc: "Official high-performance kit provided to every registered player" },
    { icon: "🍽️", label: "Match-Day Food", desc: "Nutritious meals provided for every player on every match day" },
    { icon: "💰", label: "Auction Entry", desc: "Auction base price ₹500 – ₹2,000 per player based on performance rating" },
    { icon: "📋", label: "Registration Fee", desc: "One-time fee of ₹1,500 covers kit, admin, food, and tournament entry" },
  ],
  howItWorks: [
    { step: "01", title: "Register", desc: "Pay ₹1,500 registration fee. Your profile goes into the player pool." },
    { step: "02", title: "Get Rated", desc: "Academy coaches evaluate your skills and set your auction base price (₹500–₹2,000)." },
    { step: "03", title: "Auction Day", desc: "Team captains bid for players in a live auction. Highest bid wins your contract." },
    { step: "04", title: "Play & Win", desc: "Compete in T20 matches. Top performers take home trophies and cash prizes." },
  ],
};

/* ── Dummy upcoming / past tournaments ──────────────────── */
const otherTournaments = [
  {
    id: 2,
    season: "Season 2024",
    name: "Braj Premier Cup",
    short: "BPC",
    status: "Completed",
    statusColor: "#888",
    format: "T20 · Knockout",
    dates: "March – May 2024",
    teams: 8,
    players: 120,
    winner: "Royal Strikers XI",
    img: null,
  },
  {
    id: 3,
    season: "Season 2023",
    name: "Mathura Cricket Championship",
    short: "MCC",
    status: "Completed",
    statusColor: "#888",
    format: "T20 · League + Knockouts",
    dates: "July – September 2023",
    teams: 6,
    players: 90,
    winner: "Golden Eagles CC",
    img: null,
  },
  {
    id: 4,
    season: "Coming Soon",
    name: "Braj U-19 Invitational",
    short: "U19",
    status: "Upcoming",
    statusColor: "#4a8fd4",
    format: "50-over · Age group U-19",
    dates: "October 2025",
    teams: null,
    players: null,
    winner: null,
    img: null,
  },
];

export default function ProgramsPage() {

  return (
    <>
      <Cursor />
      <main style={{ minHeight: "100vh" }}>
        <Navbar />

        {/* ── Page Header ── */}
        <div className="trn-header">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="trn-eyebrow">Tournaments</p>
            <h1 className="trn-page-title">
              THE ARENA<br />
              <em>AWAITS</em>
            </h1>
            <p className="trn-page-subtitle">
              Compete. Get auctioned. Win trophies. Braj Cricket Academy runs full
              T20 leagues with auction-format team selection and real cash prizes.
            </p>
          </motion.div>
        </div>

        {/* ── Main Tournament ── */}
        <SectionFrame>
          <div className="trn-main-wrap">
            {/* Header strip */}
            <motion.div
              className="trn-main-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top banner */}
              <div className="trn-main-banner">
                <div className="trn-main-banner-left">
                  <div className="trn-main-short">{mainTournament.short}</div>
                  <div>
                    <p className="trn-main-season">{mainTournament.season}</p>
                    <h2 className="trn-main-name">{mainTournament.name}</h2>
                    <div className="trn-main-meta">
                      <span className="trn-main-format">{mainTournament.format}</span>
                      <span className="trn-main-dot">·</span>
                      <span className="trn-main-dates">{mainTournament.dates}</span>
                    </div>
                    <p className="trn-main-venue">📍 {mainTournament.venue}</p>
                  </div>
                </div>
                <div className="trn-main-banner-right">
                  <span
                    className="trn-status-pill"
                    style={{ background: `${mainTournament.statusColor}22`, color: mainTournament.statusColor, borderColor: `${mainTournament.statusColor}44` }}
                  >
                    ● {mainTournament.status}
                  </span>
                  <div className="trn-reg-fee">
                    <span className="trn-reg-amount">₹{mainTournament.registrationFee.toLocaleString("en-IN")}</span>
                    <span className="trn-reg-label">Registration Fee</span>
                  </div>
                  <Link href="/enroll?package=tournament" className="trn-register-btn">
                    Register Now →
                  </Link>
                </div>
              </div>

              {/* Perks row */}
              <div className="trn-perks-row">
                {mainTournament.perks.map((p) => (
                  <div key={p.label} className="trn-perk-item">
                    <span className="trn-perk-icon">{p.icon}</span>
                    <div>
                      <p className="trn-perk-title">{p.label}</p>
                      <p className="trn-perk-desc">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prizes grid */}
              <div className="trn-prizes-section">
                <p className="trn-sub-label">Awards &amp; Prizes</p>
                <div className="trn-prizes-grid">
                  {mainTournament.prizes.map((pr, i) => (
                    <motion.div
                      key={pr.title}
                      className="trn-prize-card"
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                      <span className="trn-prize-icon">{pr.icon}</span>
                      <p className="trn-prize-title">{pr.title}</p>
                      <p className="trn-prize-value">{pr.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="trn-how-section">
                <p className="trn-sub-label">How It Works</p>
                <div className="trn-steps-grid">
                  {mainTournament.howItWorks.map((s) => (
                    <div key={s.step} className="trn-step-card">
                      <span className="trn-step-num">{s.step}</span>
                      <h4 className="trn-step-title">{s.title}</h4>
                      <p className="trn-step-desc">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="trn-main-footer">
                <div>
                  <p className="trn-main-footer-title">Ready to compete?</p>
                  <p className="trn-main-footer-sub">Spots are limited. Register before the auction day cutoff.</p>
                </div>
                <Link href="/enroll?package=tournament" className="trn-register-btn">
                  Register — ₹1,500 →
                </Link>
              </div>
            </motion.div>
          </div>
        </SectionFrame>

        {/* ── Other Tournaments ── */}
        <SectionFrame>
          <div className="trn-others-wrap">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="trn-eyebrow" style={{ marginBottom: 8 }}>History &amp; Upcoming</p>
              <h2 className="trn-section-title">More Tournaments</h2>
            </motion.div>

            <div className="trn-others-grid">
              {otherTournaments.map((t, i) => (
                <motion.div
                  key={t.id}
                  className="trn-other-card"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="trn-other-top">
                    <div className="trn-other-short">{t.short}</div>
                    <span
                      className="trn-status-pill"
                      style={{ background: `${t.statusColor}1a`, color: t.statusColor, borderColor: `${t.statusColor}33` }}
                    >
                      {t.status}
                    </span>
                  </div>
                  <p className="trn-other-season">{t.season}</p>
                  <h3 className="trn-other-name">{t.name}</h3>
                  <p className="trn-other-format">{t.format}</p>
                  <p className="trn-other-dates">📅 {t.dates}</p>

                  {t.teams && (
                    <div className="trn-other-stats">
                      <div className="trn-other-stat">
                        <span className="trn-other-stat-val">{t.teams}</span>
                        <span className="trn-other-stat-label">Teams</span>
                      </div>
                      <div className="trn-other-stat">
                        <span className="trn-other-stat-val">{t.players}</span>
                        <span className="trn-other-stat-label">Players</span>
                      </div>
                    </div>
                  )}

                  {t.winner && (
                    <div className="trn-other-winner">
                      🏆 <span>{t.winner}</span>
                    </div>
                  )}

                  {t.status === "Upcoming" && (
                    <Link href="/enroll?package=tournament" className="trn-other-cta">
                      Notify Me →
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </SectionFrame>

        <SectionFrame>
          <CTAFooter />
        </SectionFrame>
      </main>

      <style jsx global>{`
        /* ── Header ── */
        .trn-header {
          padding: 128px 5% 48px;
        }
        .trn-eyebrow {
          font-family: var(--font-dm), sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.75;
          margin-bottom: 12px;
        }
        .trn-page-title {
          font-family: var(--font-bebas), serif;
          font-size: clamp(56px, 8vw, 120px);
          color: var(--dark);
          line-height: 1;
          margin: 0 0 20px;
          letter-spacing: 0.01em;
        }
        .trn-page-title em {
          color: var(--gold);
          font-style: italic;
        }
        .trn-page-subtitle {
          font-family: var(--font-dm), sans-serif;
          font-size: clamp(14px, 1.2vw, 17px);
          color: var(--dark);
          opacity: 0.55;
          max-width: 560px;
          line-height: 1.7;
        }

        /* ── Main tournament card ── */
        .trn-main-wrap {
          padding: 48px 7% 72px;
        }
        .trn-main-card {
          border-radius: 24px;
          border: 1px solid rgba(201,168,76,0.22);
          background: rgba(22,26,34,0.85);
          overflow: hidden;
        }
        html:not(.dark) .trn-main-card {
          background: #fff;
          box-shadow: 0 8px 40px rgba(0,0,0,0.08);
        }

        /* Banner */
        .trn-main-banner {
          padding: 48px 52px 40px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 32px;
          border-bottom: 1px solid rgba(201,168,76,0.1);
          flex-wrap: wrap;
        }
        .trn-main-banner-left {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        .trn-main-short {
          font-family: var(--font-bebas), serif;
          font-size: 48px;
          color: var(--gold);
          line-height: 1;
          letter-spacing: 0.04em;
          min-width: 72px;
          padding-top: 4px;
        }
        .trn-main-season {
          font-family: var(--font-dm), sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.7;
          margin-bottom: 6px;
        }
        .trn-main-name {
          font-family: var(--font-bebas), serif;
          font-size: clamp(28px, 3.5vw, 48px);
          color: var(--dark);
          margin: 0 0 8px;
          line-height: 1;
          letter-spacing: 0.02em;
        }
        .trn-main-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .trn-main-format {
          font-family: var(--font-dm), sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--dark);
          opacity: 0.7;
        }
        .trn-main-dot { color: var(--gold); opacity: 0.5; }
        .trn-main-dates {
          font-family: var(--font-dm), sans-serif;
          font-size: 12px;
          color: var(--dark);
          opacity: 0.5;
        }
        .trn-main-venue {
          font-family: var(--font-dm), sans-serif;
          font-size: 11px;
          color: var(--dark);
          opacity: 0.4;
          margin: 0;
        }

        .trn-main-banner-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }
        .trn-status-pill {
          font-family: var(--font-dm), sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid;
        }
        .trn-reg-fee {
          text-align: right;
        }
        .trn-reg-amount {
          font-family: var(--font-bebas), serif;
          font-size: 36px;
          color: var(--gold);
          line-height: 1;
          letter-spacing: 0.02em;
        }
        .trn-reg-label {
          display: block;
          font-family: var(--font-dm), sans-serif;
          font-size: 10px;
          color: var(--dark);
          opacity: 0.4;
          letter-spacing: 0.06em;
          margin-top: 2px;
        }
        .trn-register-btn {
          display: inline-block;
          padding: 12px 24px;
          border-radius: 12px;
          background: var(--gold);
          color: #0D1117;
          font-family: var(--font-dm), sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: opacity 0.2s, transform 0.2s;
        }
        .trn-register-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        /* Perks row */
        .trn-perks-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .trn-perk-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 32px 36px;
          border-right: 1px solid rgba(201,168,76,0.08);
        }
        .trn-perk-item:last-child { border-right: none; }
        .trn-perk-icon {
          font-size: 22px;
          flex-shrink: 0;
          line-height: 1.3;
        }
        .trn-perk-title {
          font-family: var(--font-dm), sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--dark);
          margin: 0 0 4px;
        }
        .trn-perk-desc {
          font-family: var(--font-dm), sans-serif;
          font-size: 11px;
          color: var(--dark);
          opacity: 0.45;
          line-height: 1.5;
          margin: 0;
        }

        /* Prizes */
        .trn-prizes-section {
          padding: 44px 52px;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .trn-sub-label {
          font-family: var(--font-dm), sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.7;
          margin-bottom: 24px;
        }
        .trn-prizes-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .trn-prize-card {
          border-radius: 14px;
          padding: 24px 22px;
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.15);
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: background 0.2s;
        }
        .trn-prize-card:hover {
          background: rgba(201,168,76,0.1);
        }
        .trn-prize-icon { font-size: 22px; line-height: 1; }
        .trn-prize-title {
          font-family: var(--font-dm), sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--dark);
          margin: 0;
          line-height: 1.3;
        }
        .trn-prize-value {
          font-family: var(--font-bebas), serif;
          font-size: 17px;
          color: var(--gold);
          margin: 0;
          letter-spacing: 0.03em;
          line-height: 1;
        }

        /* How it works */
        .trn-how-section {
          padding: 44px 52px;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .trn-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .trn-step-card {
          padding: 24px 32px 24px 0;
          border-right: 1px solid rgba(201,168,76,0.08);
        }
        .trn-step-card:first-child { padding-left: 0; }
        .trn-step-card:last-child { border-right: none; padding-right: 0; }
        .trn-step-card:not(:first-child) { padding-left: 32px; }
        .trn-step-num {
          font-family: var(--font-bebas), serif;
          font-size: 36px;
          color: var(--gold);
          opacity: 0.3;
          line-height: 1;
          display: block;
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }
        .trn-step-title {
          font-family: var(--font-bebas), serif;
          font-size: 20px;
          color: var(--dark);
          margin: 0 0 6px;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .trn-step-desc {
          font-family: var(--font-dm), sans-serif;
          font-size: 12px;
          color: var(--dark);
          opacity: 0.5;
          line-height: 1.55;
          margin: 0;
        }

        /* Main footer */
        .trn-main-footer {
          padding: 32px 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          background: rgba(201,168,76,0.04);
        }
        html:not(.dark) .trn-main-footer {
          background: rgba(201,168,76,0.05);
        }
        .trn-main-footer-title {
          font-family: var(--font-bebas), serif;
          font-size: 22px;
          color: var(--dark);
          margin: 0 0 4px;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .trn-main-footer-sub {
          font-family: var(--font-dm), sans-serif;
          font-size: 12px;
          color: var(--dark);
          opacity: 0.45;
          margin: 0;
        }

        /* ── Other tournaments ── */
        .trn-others-wrap {
          padding: 48px 7% 72px;
        }
        .trn-section-title {
          font-family: var(--font-bebas), serif;
          font-size: clamp(32px, 4vw, 56px);
          color: var(--dark);
          line-height: 1;
          margin: 0 0 32px;
          letter-spacing: 0.01em;
        }
        .trn-others-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .trn-other-card {
          border-radius: 18px;
          padding: 28px 26px;
          background: rgba(22,26,34,0.7);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .trn-other-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        html:not(.dark) .trn-other-card {
          background: #fff;
          border-color: rgba(201,168,76,0.16);
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
        }
        .trn-other-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .trn-other-short {
          font-family: var(--font-bebas), serif;
          font-size: 32px;
          color: var(--gold);
          line-height: 1;
          letter-spacing: 0.04em;
        }
        .trn-other-season {
          font-family: var(--font-dm), sans-serif;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.6;
          margin-bottom: 4px;
        }
        .trn-other-name {
          font-family: var(--font-bebas), serif;
          font-size: 22px;
          color: var(--dark);
          margin: 0 0 8px;
          line-height: 1.1;
          letter-spacing: 0.02em;
        }
        .trn-other-format {
          font-family: var(--font-dm), sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: var(--dark);
          opacity: 0.55;
          margin-bottom: 4px;
        }
        .trn-other-dates {
          font-family: var(--font-dm), sans-serif;
          font-size: 11px;
          color: var(--dark);
          opacity: 0.4;
          margin-bottom: 16px;
        }
        .trn-other-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 14px;
        }
        .trn-other-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .trn-other-stat-val {
          font-family: var(--font-bebas), serif;
          font-size: 26px;
          color: var(--dark);
          line-height: 1;
          letter-spacing: 0.02em;
        }
        .trn-other-stat-label {
          font-family: var(--font-dm), sans-serif;
          font-size: 10px;
          color: var(--dark);
          opacity: 0.4;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .trn-other-winner {
          font-family: var(--font-dm), sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: var(--gold);
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .trn-other-cta {
          display: inline-block;
          margin-top: auto;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1px solid rgba(201,168,76,0.4);
          color: var(--gold);
          font-family: var(--font-dm), sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
          width: fit-content;
        }
        .trn-other-cta:hover { background: rgba(201,168,76,0.08); }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .trn-perks-row { grid-template-columns: repeat(2, 1fr); }
          .trn-prizes-grid { grid-template-columns: repeat(4, 1fr); }
          .trn-steps-grid { grid-template-columns: repeat(2, 1fr); gap: 0; }
          .trn-step-card { border-right: none !important; border-bottom: 1px solid rgba(201,168,76,0.08); padding: 24px 0 !important; }
          .trn-step-card:last-child, .trn-step-card:nth-child(even) { border-bottom: none; }
        }
        @media (max-width: 900px) {
          .trn-others-grid { grid-template-columns: 1fr 1fr; }
          .trn-prizes-grid { grid-template-columns: repeat(2, 1fr); }
          .trn-main-wrap, .trn-others-wrap { padding-left: 5%; padding-right: 5%; }
          .trn-main-banner { padding: 36px 32px 28px; }
          .trn-prizes-section, .trn-how-section { padding: 36px 32px; }
          .trn-perk-item { padding: 28px 24px; }
          .trn-main-footer { padding: 28px 32px; }
        }
        @media (max-width: 700px) {
          .trn-main-banner { padding: 28px 24px; }
          .trn-main-banner-right { align-items: flex-start; width: 100%; }
          .trn-perks-row { grid-template-columns: 1fr 1fr; }
          .trn-perk-item { padding: 20px 20px; border-right: none; border-bottom: 1px solid rgba(201,168,76,0.08); }
          .trn-prizes-section, .trn-how-section { padding: 28px 24px; }
          .trn-main-footer { padding: 24px; }
          .trn-others-grid { grid-template-columns: 1fr; }
          .trn-others-wrap, .trn-main-wrap { padding: 28px 16px 48px; }
        }
        @media (max-width: 600px) {
          .trn-header { padding: 96px 16px 36px; }
          .trn-main-banner-left { flex-direction: column; gap: 12px; }
          .trn-main-short { font-size: 36px; }
          .trn-perks-row { grid-template-columns: 1fr; }
          .trn-prizes-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
