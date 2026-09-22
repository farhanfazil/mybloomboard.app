import dynamic from "next/dynamic";
import { Header } from "@/components/ui/header-2";
import AppPreviewScroll from "@/components/sections/AppPreviewScroll";
import FeatureGrid from "@/components/sections/FeatureGrid";

// Above-fold sections load immediately ↑
// Below-fold sections are lazy-loaded — don't block initial paint ↓

// Hidden for now (see the comment in the JSX); to bring them back, re-add:
//   AIFeatureCarousel, DeepDiveFlight, Walkthrough, StatsBar  (all in @/components/sections)
const Testimonials     = dynamic(() => import("@/components/sections/Testimonials"));
const PlanQuiz          = dynamic(() => import("@/components/sections/PlanQuiz"));
const TrustBar          = dynamic(() => import("@/components/sections/TrustBar"));
const Pricing           = dynamic(() => import("@/components/sections/Pricing"));
const HowItWorks        = dynamic(() => import("@/components/sections/HowItWorks"));
const FAQ               = dynamic(() => import("@/components/sections/FAQ"));
const ComparisonSection = dynamic(() => import("@/components/sections/ComparisonSection"));
const DownloadCTA       = dynamic(() => import("@/components/sections/DownloadCTA"));
const Footer            = dynamic(() => import("@/components/sections/Footer"));

export default function Home() {
  return (
    <main>
      <Header />
      <AppPreviewScroll />
      <ComparisonSection tables={["teams"]} />
      <FeatureGrid />
      {/* Hidden while the live demo carries the product story — restore by uncommenting.
      <AIFeatureCarousel />
      <DeepDiveFlight>
        <Walkthrough />
        <StatsBar />
      </DeepDiveFlight>
      */}
      <div className="bg-black">
        <Testimonials />
        <PlanQuiz />
      </div>
      <TrustBar />
      <Pricing />
      <HowItWorks />
      <FAQ />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
