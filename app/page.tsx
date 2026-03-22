import Cursor from "./components/Cursor";
import Loader from "./components/Loader";
import GlowBG from "./components/GlowBG";
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

export default function Home() {
  return (
    <>
      <Loader />
      <GlowBG />
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
        <SectionFrame><Coaches /></SectionFrame>
        <SectionFrame><Testimonial /></SectionFrame>
        <SectionFrame><CTAFooter /></SectionFrame>
      </main>
    </>
  );
}
