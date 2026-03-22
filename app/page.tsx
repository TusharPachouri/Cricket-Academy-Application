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

export default function Home() {
  return (
    <>
      <Cursor />
      <main>
        <HeroSection />

        {/* One continuous rail wrapping all sections below hero */}
        <SectionFrame>
          <Marquee />
          <BentoStats />
          <QuoteDivider
            quote="Cricket is not just a sport — it is a discipline of the mind, body, and character forged over a lifetime."
            attribution="Braj Cricket Academy · Est. 2009"
          />
          <Programs />
          <OurMethod />
          <QuoteDivider
            quote="The best coaches don't create followers. They create thinkers who can read the game before it happens."
            attribution="Rajesh Kumar · Head Coach"
          />
          <Coaches />
          <Testimonial />
          <CTAFooter />
        </SectionFrame>
      </main>
    </>
  );
}
