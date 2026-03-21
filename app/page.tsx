import Cursor from "./components/Cursor";
import StatsBar from "./components/StatsBar";
import Programs from "./components/Programs";
import Coaches from "./components/Coaches";
import Testimonial from "./components/Testimonial";
import CTAFooter from "./components/CTAFooter";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <>
      <Cursor />
      <main>
        <HeroSection />
        <StatsBar />
        <Programs />
        <Coaches />
        <Testimonial />
        <CTAFooter />
      </main>
    </>
  );
}
