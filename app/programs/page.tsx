"use client";
import { motion } from "framer-motion";
import SectionFrame from "../components/SectionFrame";
import Cursor from "../components/Cursor";
import CTAFooter from "../components/CTAFooter";
import ScrollReveal from "../components/ScrollReveal";
import Navbar from "../components/Navbar";

const programDetails = [
  {
    title: "Registration Fees",
    value: "1,500",
    description: "One-time enrollment fee for the seasonal program.",
    type: "stat",
  },
  {
    title: "Auction Base Price",
    value: "500 – 2,000",
    description: "Starting bid range for players in the internal tournament auction.",
    type: "stat",
  },
  {
    title: "Full Equipment",
    value: "Official Kit",
    description: "Full colour high-performance dress provided to every player.",
    type: "feature",
  },
  {
    title: "Hospitality",
    value: "Match Day Food",
    description: "Nutritious meals provided during every match of the tournament.",
    type: "feature",
  },
  {
    title: "Best Batsman",
    value: "5,100 + Trophy",
    description: "Reward for the top run-scorer of the tournament.",
    type: "award",
  },
  {
    title: "Best Bowler",
    value: "3,100 + Trophy",
    description: "Reward for the highest wicket-taker with the best economy.",
    type: "award",
  },
  {
    title: "Best Fielder",
    value: "2,100 + Trophy",
    description: "Reward for exceptional athleticism and catch count.",
    type: "award",
  },
  {
    title: "Match MVP",
    value: "Match Trophy",
    description: "Player of the Match awarded in every single game.",
    type: "award",
  },
  {
    title: "Special Honors",
    value: "Achievement 🏆",
    description: "Highest Four, Sixes, Catches & Wickets recognized with elite awards.",
    type: "award",
    wide: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

export default function ProgramsPage() {
  return (
    <>
      <Cursor />
      <main style={{ minHeight: "100vh" }}>
        <Navbar />

        {/* Hero header — uses same inset as SectionFrame rails */}
        <div className="programs-page-header">
          <ScrollReveal direction="up">
            <h1 className="programs-page-title">
              THE ELITE<br />
              <em>PROGRAMS</em>
            </h1>
            <p className="programs-page-subtitle">
              Defining the standard of cricketing excellence. Our programs are built
              to refine talent, reward discipline, and forge champions.
            </p>
          </ScrollReveal>
        </div>

        {/* Bento grid inside SectionFrame */}
        <SectionFrame>
          <div className="programs-page-grid-wrap">
            <motion.div
              className="programs-page-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {programDetails.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className={`programs-page-card${item.wide ? " programs-page-card--wide" : ""}`}
                >
                  <span className="programs-card-type">{item.type}</span>
                  <h3 className="programs-card-value">{item.value}</h3>
                  <h4 className="programs-card-title">{item.title}</h4>
                  <p className="programs-card-desc">{item.description}</p>
                  <div className="programs-card-glow" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </SectionFrame>

        <SectionFrame>
          <CTAFooter />
        </SectionFrame>
      </main>

      <style jsx global>{`
        /* ── Programs page layout ── */
        .programs-page-header {
          padding: 128px 5% 48px;
        }
        .programs-page-title {
          font-family: var(--font-bebas), 'Noto Serif', serif;
          font-size: clamp(56px, 8vw, 120px);
          color: var(--gold);
          line-height: 1;
          margin-bottom: 20px;
          letter-spacing: 0.01em;
        }
        .programs-page-title em {
          font-style: italic;
        }
        .programs-page-subtitle {
          font-family: var(--font-dm), sans-serif;
          font-size: clamp(14px, 1.2vw, 17px);
          color: var(--dark);
          opacity: 0.6;
          max-width: 480px;
          line-height: 1.7;
        }

        /* Grid wrapper — aligns to the SectionFrame rail inset */
        .programs-page-grid-wrap {
          padding: 60px 5%;
        }

        /* 3-column responsive grid */
        .programs-page-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        /* Card */
        .programs-page-card {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          padding: 32px 28px;
          background: rgba(28, 32, 38, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: background 0.25s ease;
          min-height: 180px;
        }
        .programs-page-card:hover {
          background: rgba(32, 38, 46, 0.9);
        }
        html:not(.dark) .programs-page-card {
          background: rgba(245, 241, 232, 0.7);
          border-color: rgba(201, 168, 76, 0.15);
        }
        html:not(.dark) .programs-page-card:hover {
          background: rgba(235, 229, 212, 0.9);
        }

        /* Wide card spans 2 columns */
        .programs-page-card--wide {
          grid-column: span 2;
        }

        .programs-card-type {
          font-family: var(--font-fell), serif;
          font-size: 10px;
          color: var(--gold);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.75;
        }
        .programs-card-value {
          font-family: var(--font-playfair), serif;
          font-size: clamp(22px, 2.5vw, 34px);
          color: var(--gold);
          font-weight: 700;
          line-height: 1.15;
          margin: 0;
          transition: transform 0.4s ease;
          transform-origin: left;
        }
        .programs-page-card:hover .programs-card-value {
          transform: scale(1.04);
        }
        .programs-card-title {
          font-family: var(--font-dm), sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: var(--dark);
          margin: 0;
        }
        .programs-card-desc {
          font-family: var(--font-dm), sans-serif;
          font-size: 12.5px;
          color: var(--dark);
          opacity: 0.4;
          line-height: 1.6;
          margin-top: auto;
        }
        .programs-card-glow {
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 160px;
          height: 160px;
          background: rgba(201, 168, 76, 0.05);
          border-radius: 50%;
          filter: blur(32px);
          pointer-events: none;
          transition: background 0.3s ease;
        }
        .programs-page-card:hover .programs-card-glow {
          background: rgba(201, 168, 76, 0.1);
        }

        /* Tablet: 2 columns */
        @media (max-width: 1100px) and (min-width: 601px) {
          .programs-page-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .programs-page-card--wide {
            grid-column: span 2;
          }
          .programs-page-header {
            padding: 100px 5% 40px;
          }
          .programs-page-grid-wrap {
            padding: 48px 5%;
          }
        }

        /* Mobile: 1 column, 16px inset to match mobile SectionFrame rail */
        @media (max-width: 600px) {
          .programs-page-header {
            padding: 96px 16px 36px;
          }
          .programs-page-grid-wrap {
            padding: 36px 16px;
          }
          .programs-page-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .programs-page-card--wide {
            grid-column: span 1;
          }
          .programs-page-card {
            padding: 24px 20px;
            min-height: auto;
          }
        }
      `}</style>
    </>
  );
}
