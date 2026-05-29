import PageHero from "@/components/layout/PageHero";
import { MissionVision } from "./VisionMission";

export function MissionMain() {
  return (
    <main className="min-h-screen">
      <PageHero title="Mission & Vision" image="/assets/vision34.jpeg" />
      <MissionVision />
    </main>
  );
}
