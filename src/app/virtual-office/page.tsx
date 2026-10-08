import { LandingView, landingMetadata } from "@/components/seo/LandingView";

export const metadata = landingMetadata("virtual-office");

export default function Page() {
  return <LandingView slug="virtual-office" />;
}
