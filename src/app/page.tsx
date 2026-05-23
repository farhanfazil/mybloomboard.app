import Navbar from "@/components/nav/Navbar";
import AppPreviewScroll from "@/components/sections/AppPreviewScroll";
import FeatureTicker from "@/components/ui/FeatureTicker";
import FeatureGrid from "@/components/sections/FeatureGrid";
import Walkthrough from "@/components/sections/Walkthrough";
import StatsBar from "@/components/sections/StatsBar";
import Pricing from "@/components/sections/Pricing";
import TechStack from "@/components/sections/TechStack";
import DownloadCTA from "@/components/sections/DownloadCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <AppPreviewScroll />
      <FeatureTicker />
      <FeatureGrid />
      <Walkthrough />
      <StatsBar />
      <Pricing />
      <TechStack />
      <DownloadCTA />
      <Footer />
    </main>
  );
}
