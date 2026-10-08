import { LandingView, landingMetadata } from "@/components/seo/LandingView";

export const metadata = landingMetadata("kanban-board-app");

export default function Page() {
  return <LandingView slug="kanban-board-app" />;
}
