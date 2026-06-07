import { Header } from "@/components/ui/header-2";
import AppPreviewScroll from "@/components/sections/AppPreviewScroll";
import FeatureGrid from "@/components/sections/FeatureGrid";
import AIFeatureCarousel from "@/components/sections/AIFeatureCarousel";
import Walkthrough from "@/components/sections/Walkthrough";
import DeepDiveFlight from "@/components/sections/DeepDiveFlight";
import StatsBar from "@/components/sections/StatsBar";
import Pricing from "@/components/sections/Pricing";
import TrustBar from "@/components/sections/TrustBar";
import Testimonials from "@/components/sections/Testimonials";
import PlanQuiz from "@/components/sections/PlanQuiz";
import FAQ from "@/components/sections/FAQ";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <AppPreviewScroll />
      <FeatureGrid />
      <AIFeatureCarousel />
      <DeepDiveFlight>
        <Walkthrough />
        <StatsBar />
      </DeepDiveFlight>
      <Testimonials />
      <PlanQuiz />
      <TrustBar />
      <Pricing />
      <FAQ />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
