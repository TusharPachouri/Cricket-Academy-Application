import Cursor from "./components/Cursor";
import StatsBar from "./components/StatsBar";
import Programs from "./components/Programs";
import Coaches from "./components/Coaches";
import Testimonial from "./components/Testimonial";
import CTAFooter from "./components/CTAFooter";
import HeroSection from "./components/HeroSection";
import Marquee from "./components/Marquee";

export default function Home() {
  return (
    <>
      <Cursor />
      <main>
        <HeroSection />
        <Marquee />
        <StatsBar />
        <Programs />
        <Coaches />
        <Testimonial />
        <CTAFooter />
      </main>
    </>
  );
}
