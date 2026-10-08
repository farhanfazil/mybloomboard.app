import { LandingView, landingMetadata } from "@/components/seo/LandingView";

export const metadata = landingMetadata("daily-planner-app");

export default function Page() {
  return <LandingView slug="daily-planner-app" />;
}
