import { Coach } from "../../lib/models";
import { connectDB } from "../../lib/mongodb";
import Navbar from "../components/Navbar";
import CTAFooter from "../components/CTAFooter";
import SectionFrame from "../components/SectionFrame";
import Cursor from "../components/Cursor";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getCoaches() {
  await connectDB();
  return await Coach.find().sort({ displayOrder: 1 }).lean();
}

export default async function CoachesPage() {
  const coaches = await getCoaches();

  return (
    <>
      <Cursor />
      <main className="coaches-page-root min-h-screen">
        <Navbar />

        {/* Hero header */}
        <section className="coaches-hero-section">
          <p className="coaches-eyebrow uppercase tracking-[0.2em] text-[10px] font-bold mb-4">
            Our Mentors
          </p>
          <h1 className="font-bebas coaches-page-title leading-none tracking-tight">
            WORLD-CLASS <br />
            <span className="text-[#C5A059] italic font-serif font-light">LEADERSHIP</span>
          </h1>
          <p className="coaches-page-subtitle mt-6 max-w-xl font-dm leading-relaxed text-sm md:text-base">
            Every coach at Braj Cricket Academy is a former player, a lifelong student of the game, and a genuine mentor. Our faculty brings international expertise and state-level pedigree to every session.
          </p>
        </section>

        {/* Coaches Grid — wrapped in SectionFrame so lines appear at top of cards */}
        <SectionFrame>
          <section className="coaches-grid-section">
            <div className="coaches-grid">
              {coaches.map((coach: any) => (
                <div
                  key={coach._id.toString()}
                  className="coaches-card group relative rounded-2xl overflow-hidden border border-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img
                      src={coach.photoUrl}
                      alt={coach.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#10141a] via-transparent to-transparent opacity-90" />
                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                      <span className="bg-[#C5A059] text-[#10141a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {coach.specialization.split(' & ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-8 -mt-16 md:-mt-20 relative z-10">
                    <h3 className="font-serif italic text-2xl md:text-3xl text-white mb-2">
                      {coach.name}
                    </h3>
                    <p className="text-[#C5A059] font-bebas text-base md:text-lg tracking-wider mb-3 md:mb-4 opacity-80">
                      {coach.specialization}
                    </p>
                    <p className="text-white/50 text-sm line-clamp-3 font-dm leading-relaxed mb-6 md:mb-8">
                      {coach.bio}
                    </p>
                    <Link
                      href={`/coaches/${coach.slug}`}
                      className="inline-flex items-center text-[#C5A059] font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
                    >
                      View Mastery Profile
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionFrame>

        <SectionFrame>
          <CTAFooter />
        </SectionFrame>

        <style>{`
          .coaches-page-root {
            background: #10141a;
            overflow-x: hidden;
          }
          html:not(.dark) .coaches-page-root { background: var(--cream, #F4EFE4); }

          .coaches-hero-section {
            padding: 128px 7% 56px;
          }
          .coaches-grid-section {
            padding: 48px 7% 72px;
          }
          .coaches-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          @media (max-width: 1024px) {
            .coaches-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 768px) {
            .coaches-hero-section { padding: 100px 6% 40px; }
            .coaches-grid-section { padding: 36px 6% 56px; }
            .coaches-grid { grid-template-columns: 1fr; gap: 20px; }
          }

          .coaches-eyebrow { color: #C5A059; }
          html:not(.dark) .coaches-eyebrow { color: #7a5c1e; }

          .coaches-page-title {
            font-size: clamp(36px, 11vw, 144px);
            color: #fff;
          }
          html:not(.dark) .coaches-page-title { color: #1a1209; }

          .coaches-page-subtitle { color: rgba(255,255,255,0.4); }
          html:not(.dark) .coaches-page-subtitle { color: rgba(26,18,9,0.55); }

          .coaches-card { background: #1c2026; }
          html:not(.dark) .coaches-card {
            background: #fff;
            border-color: rgba(201,168,76,0.2) !important;
            box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          }

          @media (max-width: 640px) {
            .coaches-page-title { font-size: clamp(36px, 13vw, 72px); }
          }
        `}</style>
      </main>
    </>
  );
}
