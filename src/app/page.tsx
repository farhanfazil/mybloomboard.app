import CurtainReveal from "@/components/sections/CurtainReveal";
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
const FAQ               = dynamic(() => import("@/components/sections/FAQ"));
const ComparisonSection = dynamic(() => import("@/components/sections/ComparisonSection"));
const DownloadCTA       = dynamic(() => import("@/components/sections/DownloadCTA"));
const Footer            = dynamic(() => import("@/components/sections/Footer"));

export default function Home() {
  return (
    <main>
      <Header />
      <AppPreviewScroll />
      <FeatureWall />
      {/* Hidden while the live demo carries the product story — restore by uncommenting.
      <AIFeatureCarousel />
      <DeepDiveFlight>
        <Walkthrough />
        <StatsBar />
      </DeepDiveFlight>
      */}
      {/* One light panel (the comparison, then the plan quiz and trust row) lifts
          away like a lid, uncovering Pricing waiting in black underneath. */}
      <CurtainReveal
        lidClassName="flex flex-col rounded-[28px] bg-[#f5f5f7] sm:rounded-[36px]"
        lidShadow="none"
        lid={
          <div data-hide-header className="flex flex-1 flex-col">
            <ComparisonSection tables={["teams"]} embedded />
            <PlanQuiz light />
            <TrustBar light />
          </div>
        }
        under={<Pricing />}
      />
      <FAQ />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
