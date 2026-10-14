import dynamic from "next/dynamic";
import { Header } from "@/components/ui/header-2";
import AppPreviewScroll from "@/components/sections/AppPreviewScroll";
import FeatureWall from "@/components/showcase/FeatureWall";

// Above-fold sections load immediately ↑
// Below-fold sections are lazy-loaded — don't block initial paint ↓

// Hidden for now (see the comment in the JSX); to bring them back, re-add:
//   AIFeatureCarousel, DeepDiveFlight, Walkthrough, StatsBar  (all in @/components/sections)
// Testimonials (@/components/sections/Testimonials) was removed before launch.
// HowItWorks ("Up and running in minutes", @/components/sections/HowItWorks) removed 2026-10-03.
const PlanQuiz          = dynamic(() => import("@/components/sections/PlanQuiz"));
const TrustBar          = dynamic(() => import("@/components/sections/TrustBar"));
const Pricing           = dynamic(() => import("@/components/sections/Pricing"));
const Proof             = dynamic(() => import("@/components/sections/Proof"));
const FAQ               = dynamic(() => import("@/components/sections/FAQ"));
const ComparisonSection = dynamic(() => import("@/components/sections/ComparisonSection"));
const DownloadCTA       = dynamic(() => import("@/components/sections/DownloadCTA"));
const Footer            = dynamic(() => import("@/components/sections/Footer"));

export default function Home() {
  return (
    <main>
      <Header />
      <AppPreviewScroll />
      {/* After the hero the page scrolls plainly: no snapping, pinning or curtain
          (SnapPoints, PinnedSection and CurtainReveal are kept for later use). */}
      <FeatureWall />
      <Proof />
      {/* Hidden while the live demo carries the product story — restore by uncommenting.
      <AIFeatureCarousel />
      <DeepDiveFlight>
        <Walkthrough />
        <StatsBar />
      </DeepDiveFlight>
      */}
      <div className="bg-black px-2 sm:px-4">
        <div data-hide-header className="flex flex-col rounded-[28px] bg-[#f5f5f7] sm:rounded-[36px]">
          <ComparisonSection tables={["teams"]} embedded />
          <PlanQuiz light />
          <TrustBar light />
        </div>
      </div>
      <Pricing />
      <FAQ />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
