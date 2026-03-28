import Cursor from "./components/Cursor";
import BentoStats from "./components/BentoStats";
import Programs from "./components/Programs";
import Coaches from "./components/Coaches";
import Testimonial from "./components/Testimonial";
import CTAFooter from "./components/CTAFooter";
import HeroSection from "./components/HeroSection";
import Marquee from "./components/Marquee";
import OurMethod from "./components/OurMethod";
import QuoteDivider from "./components/QuoteDivider";
import SectionFrame from "./components/SectionFrame";

import { Coach } from "../lib/models";
import { connectDB } from "../lib/mongodb";

export const dynamic = "force-dynamic";

async function getCoaches() {
  await connectDB();
  return await Coach.find().sort({ displayOrder: 1 }).limit(3).lean();
}

export default async function Home() {
  const coaches = await getCoaches();

  return (
    <>
      <Cursor />
      <main>
        <HeroSection />

        <SectionFrame><Marquee /></SectionFrame>
        <SectionFrame><BentoStats /></SectionFrame>
        <SectionFrame>
          <QuoteDivider
            quote="Cricket is not just a sport — it is a discipline of the mind, body, and character forged over a lifetime."
            attribution="Braj Cricket Academy · Est. 2009"
          />
        </SectionFrame>
        <SectionFrame><Programs /></SectionFrame>
        <SectionFrame><OurMethod /></SectionFrame>
        <SectionFrame>
          <QuoteDivider
            quote="The best coaches don't create followers. They create thinkers who can read the game before it happens."
            attribution="Rajesh Kumar · Head Coach"
          />
        </SectionFrame>
        <SectionFrame><Coaches initialCoaches={JSON.parse(JSON.stringify(coaches))} /></SectionFrame>
        <SectionFrame><Testimonial /></SectionFrame>
        <SectionFrame><CTAFooter /></SectionFrame>
      </main>
    </>
  );
}
