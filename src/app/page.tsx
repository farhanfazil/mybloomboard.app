import { Header } from "@/components/ui/header-2";
import AppPreviewScroll from "@/components/sections/AppPreviewScroll";
import FeatureTicker from "@/components/ui/FeatureTicker";
import FeatureGrid from "@/components/sections/FeatureGrid";
import Walkthrough from "@/components/sections/Walkthrough";
import StatsBar from "@/components/sections/StatsBar";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <AppPreviewScroll />
      <FeatureTicker />
      <FeatureGrid />
      <Walkthrough />
      <StatsBar />
      <Pricing />
      <FAQ />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
