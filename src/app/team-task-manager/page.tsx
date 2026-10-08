import { LandingView, landingMetadata } from "@/components/seo/LandingView";

export const metadata = landingMetadata("team-task-manager");

export default function Page() {
  return <LandingView slug="team-task-manager" />;
}
