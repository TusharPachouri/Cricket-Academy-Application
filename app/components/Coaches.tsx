"use client";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import MobileCardStack from "./MobileCardStack";
import Link from "next/link";

interface CoachData {
  name: string;
  specialization: string;
  bio: string;
  photoUrl?: string;
  slug?: string;
  initials?: string;
  credential?: string;
  color?: string;
  avatarBg?: string;
}

const slideVariants = (direction: "left" | "right", i: number) => ({
  hidden: { opacity: 0, x: direction === "left" ? -60 : 60, filter: "blur(8px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 80, damping: 20, delay: i * 0.1 },
  },
});

export default function Coaches({ initialCoaches }: { initialCoaches?: CoachData[] }) {
  const displayCoaches = initialCoaches || [
    {
      initials: "RK",
      name: "Rajesh Kumar",
      credential: "Former Ranji Trophy Captain",
      bio: "25 years of coaching experience. Trained 6 state-level players from scratch. Specialist in batting technique and mental conditioning.",
      color: "var(--gold)",
      avatarBg: "var(--gold)",
    },
    {
      initials: "AS",
      name: "Arjun Singh",
      credential: "Pace Bowling Specialist",
      bio: "Ex-first-class pacer with 180+ wickets. Developed the academy's proprietary pace development framework used by 3 current national-level bowlers.",
      color: "var(--maroon)",
      avatarBg: "var(--maroon)",
    },
    {
      initials: "PM",
      name: "Priya Mehta",
      credential: "Women's National Team Alumni",
      bio: "Pioneering women's cricket in the region. Holds certifications from ECB and BCCI. Specialist in wicket-keeping and junior development programs.",
      color: "var(--saffron)",
      avatarBg: "var(--saffron)",
    },
  ];

  return (
    <section className="coaches-section w-full py-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" delay={0}>
          <div className="mb-16">
            <h2 className="coaches-heading" style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1 }}>
              <span style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.02em" }}>Meet the </span>
              <span style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--gold)",
              }}>Coaches</span>
            </h2>
            <p className="coaches-subtitle" style={{ fontFamily: "var(--font-dm)", fontSize: 14, marginTop: 12, maxWidth: 480 }}>
              Every coach at Braj Cricket Academy is a former player, a lifelong student of the game, and a genuine mentor.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MobileCardStack topOffset={72}>
          {displayCoaches.map((c, i) => {
            const initials = c.initials || c.name.split(' ').map(n => n[0]).join('').toUpperCase();
            const avatarBg = c.avatarBg || "var(--gold)";
            const color = c.color || "var(--gold)";
            const credential = c.credential || c.specialization;

            return (
              <motion.div
                key={i}
                className="coach-card group"
                variants={slideVariants(i % 2 === 0 ? "left" : "right", i)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
              >
                {/* Avatar */}
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: avatarBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: 22, color: "#fff" }}>
                    {initials}
                  </span>
                </div>

                <h3 className="coach-name" style={{ fontFamily: "var(--font-playfair)", fontSize: 22, marginBottom: 6 }}>
                  {c.name}
                </h3>
                <p style={{
                  fontFamily: "var(--font-fell)",
                  fontSize: 11,
                  color: color,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}>
                  {credential}
                </p>
                <p className="coach-bio" style={{ fontFamily: "var(--font-dm)", fontSize: 13.5, lineHeight: 1.7, marginBottom: 20 }}>
                  {c.bio}
                </p>

                {c.slug && (
                  <Link
                    href={`/coaches/${c.slug}`}
                    style={{ color: "var(--gold)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.14em", textDecoration: "none" }}
                  >
                    View Biography →
                  </Link>
                )}
              </motion.div>
            );
          })}
          </MobileCardStack>
        </div>

        <div className="mt-16 text-center">
          <Link href="/coaches" className="coaches-all-btn">
            VIEW ALL COACHES
          </Link>
        </div>
      </div>

      <style>{`
        .coaches-section {
          background: #0B0F1A;
        }
        html:not(.dark) .coaches-section {
          background: var(--cream, #F4EFE4);
        }
        .coaches-heading {
          color: #fff;
        }
        html:not(.dark) .coaches-heading {
          color: #1a1209;
        }
        .coaches-subtitle {
          color: rgba(255,255,255,0.4);
        }
        html:not(.dark) .coaches-subtitle {
          color: rgba(26,18,9,0.5);
        }
        .coach-card {
          background: rgba(0,45,98,0.25);
          border: 1px solid rgba(201,168,76,0.18);
          border-radius: 20px;
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
        }
        html:not(.dark) .coach-card {
          background: #fff;
          border-color: rgba(201,168,76,0.25);
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
        }
        .coach-name {
          color: #fff;
        }
        html:not(.dark) .coach-name {
          color: #1a1209;
        }
        .coach-bio {
          color: rgba(255,255,255,0.5);
        }
        html:not(.dark) .coach-bio {
          color: rgba(26,18,9,0.55);
        }
        .coaches-all-btn {
          display: inline-block;
          border: 1px solid #C5A059;
          color: #C5A059;
          padding: 12px 32px;
          border-radius: 9999px;
          font-family: var(--font-bebas), serif;
          font-size: 20px;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .coaches-all-btn:hover {
          background: #C5A059;
          color: #10141a;
        }
        html:not(.dark) .coaches-all-btn:hover {
          color: #fff;
        }
        @media (max-width: 640px) {
          .coaches-section { padding-left: 20px; padding-right: 20px; }
          .coach-card { padding: 24px 20px; }
        }
      `}</style>
    </section>
  );
}
