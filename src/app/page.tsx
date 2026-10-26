import dynamic from "next/dynamic";
import { Header } from "@/components/ui/header-2";
import CurtainReveal from "@/components/sections/CurtainReveal";
import PinnedSection from "@/components/sections/PinnedSection";
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
const OfficeStory       = dynamic(() => import("@/components/sections/OfficeStory"));
const CalmStory         = dynamic(() => import("@/components/sections/CalmStory"));
const Proof             = dynamic(() => import("@/components/sections/Proof"));
const FAQ               = dynamic(() => import("@/components/sections/FAQ"));
const ComparisonSection = dynamic(() => import("@/components/sections/ComparisonSection"));
const DownloadCTA       = dynamic(() => import("@/components/sections/DownloadCTA"));
const Footer            = dynamic(() => import("@/components/sections/Footer"));
const ShortcutsSection  = dynamic(() => import("@/components/sections/ShortcutsSection"));

export default function Home() {
  return (
    <main>
      <Header />
      <AppPreviewScroll />
      {/* Chaos to calm: scattered work pulled onto one board, right after the demo. */}
      <CalmStory />
      {/* After the hero the page scrolls plainly up to the comparison, which lifts
          away like a lid over Pricing (SnapPoints kept for later use). */}
      <FeatureWall />
      <Proof />
      <ShortcutsSection />
      {/* Hidden while the live demo carries the product story — restore by uncommenting.
      <AIFeatureCarousel />
      <DeepDiveFlight>
        <Walkthrough />
        <StatsBar />
      </DeepDiveFlight>
      */}
      {/* The office stays put while the light panel (the comparison, the plan quiz and
          the trust row) slides up over it, straight-edged and full width; the panel
          then lifts away like a lid, uncovering Pricing waiting in black underneath. */}
      <div className="relative">
        <PinnedSection>
          {/* From alone to together: the live office as a scroll story (phones: the still picture). */}
          <OfficeStory />
        </PinnedSection>
        <CurtainReveal
          lidClassName="flex flex-col bg-[#f5f5f7]"
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
      </div>
      <FAQ />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
