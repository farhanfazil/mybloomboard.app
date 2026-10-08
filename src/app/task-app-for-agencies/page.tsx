import { LandingView, landingMetadata } from "@/components/seo/LandingView";

export const metadata = landingMetadata("task-app-for-agencies");

export default function Page() {
  return <LandingView slug="task-app-for-agencies" />;
}
