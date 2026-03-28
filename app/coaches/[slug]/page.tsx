import { Coach, Batch } from "../../../lib/models";
import { connectDB } from "../../../lib/mongodb";
import Navbar from "../../components/Navbar";
import CTAFooter from "../../components/CTAFooter";
import SectionFrame from "../../components/SectionFrame";
import Cursor from "../../components/Cursor";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getCoachData(slug: string) {
  await connectDB();
  const coach = await Coach.findOne({ slug }).lean();
  if (!coach) return null;

  const batches = await Batch.find({ coachName: coach.name, isActive: true }).lean();
  return { coach, batches };
}

export default async function CoachProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCoachData(slug);
  if (!data) notFound();

  const { coach, batches } = data as { coach: any, batches: any[] };

  return (
    <>
      <Cursor />
      <main className="bg-[#10141a] min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <div className="relative pt-32 pb-24 px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            {/* Coach Image */}
            <div className="w-full md:w-1/2 relative group">
              <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-[#C5A059]/20">
                <img 
                  src={coach.photoUrl} 
                  alt={coach.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#C5A059] p-8 rounded-2xl shadow-2xl hidden md:block">
                <p className="font-bebas text-5xl text-[#10141a] leading-none">
                  {coach.yearsOfExperience}+ <br />
                  <span className="text-xl tracking-widest">YEARS</span>
                </p>
              </div>
            </div>

            {/* Coach Title/Meta */}
            <div className="w-full md:w-1/2">
              <p className="text-[#C5A059] uppercase tracking-[0.3em] text-xs font-bold mb-6">
                Master Faculty
              </p>
              <h1 className="font-bebas text-white text-7xl md:text-8xl lg:text-9xl leading-[0.8] tracking-tighter mb-8">
                {coach.name.split(' ')[0]} <br />
                <span className="text-[#C5A059] italic font-serif font-light">{coach.name.split(' ')[1]}</span>
              </h1>
              <div className="flex flex-wrap gap-4 mb-12">
                <span className="px-4 py-2 border border-[#C5A059]/30 rounded-full text-[#C5A059] text-[10px] uppercase font-bold tracking-widest">
                  {coach.specialization}
                </span>
                {coach.certifications?.map((cert: string) => (
                  <span key={cert} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-[10px] uppercase font-bold tracking-widest">
                    {cert}
                  </span>
                ))}
              </div>
              <p className="text-white/60 font-dm text-lg leading-relaxed italic mb-8 border-l-2 border-[#C5A059] pl-6">
                "{coach.bio}"
              </p>
              <a 
                href="/trial" 
                className="inline-block bg-[#C5A059] text-[#10141a] px-10 py-5 rounded-full font-bebas text-2xl tracking-wider hover:scale-105 transition-transform"
              >
                REQUEST PRIVATE SESSION
              </a>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <section className="py-24 px-8 bg-[#181c22]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
            {/* Bio & Career */}
            <div>
              <h2 className="font-bebas text-white text-5xl mb-12">PLAYER <span className="text-[#C5A059]">HISTORY</span></h2>
              <div className="space-y-12">
                <div>
                  <h3 className="font-serif italic text-2xl text-[#C5A059] mb-4">Professional Playing Career</h3>
                  <p className="text-white/40 font-dm leading-relaxed">
                    {coach.playingCareer || "A distinguished career marked by resilience and strategic excellence on the field."}
                  </p>
                </div>
                <div>
                  <h3 className="font-serif italic text-2xl text-[#C5A059] mb-4">Philosophy</h3>
                  <p className="text-white/40 font-dm leading-relaxed">
                    Believes in scientific training methods coupled with traditional discipline. Every session is designed to test the mental limits of the athlete.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Batches */}
            <div>
              <h2 className="font-bebas text-white text-5xl mb-12">CURRENT <span className="text-[#C5A059]">BATCHES</span></h2>
              <div className="space-y-4">
                {batches.length > 0 ? batches.map((batch) => (
                  <div key={batch._id.toString()} className="p-6 bg-[#1c2026] rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/5 transition-all">
                    <div>
                      <h4 className="text-white font-bebas text-xl tracking-wide">{batch.name}</h4>
                      <p className="text-white/30 text-xs font-dm uppercase tracking-widest mt-1">
                        {batch.days.join(' · ')} | {batch.timeStart} - {batch.timeEnd}
                      </p>
                    </div>
                    <Link href={`/enroll?package=${batch.packageId}`} className="text-[#C5A059] font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      JOIN →
                    </Link>
                  </div>
                )) : (
                  <p className="text-white/20 italic font-dm">No active public batches currently assigned.</p>
                )}
              </div>
              
              {/* Testimonial Snippet */}
              <div className="mt-16 p-8 bg-white/5 rounded-2xl border border-[#C5A059]/10 relative">
                <span className="absolute -top-6 -left-2 text-[#C5A059] text-8xl font-serif opacity-20">“</span>
                <p className="text-white/60 font-serif italic text-lg relative z-10">
                  "Training under {coach.name.split(' ')[0]} sir has been the turning point in my cricketing career. The attention to detail in batting mechanics is simply unmatched."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center font-bold text-[#10141a]">S</div>
                  <div>
                    <p className="text-white font-bold text-xs">Sanjay Varma</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-widest">U-19 State Player</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionFrame>
          <CTAFooter />
        </SectionFrame>
      </main>
    </>
  );
}
