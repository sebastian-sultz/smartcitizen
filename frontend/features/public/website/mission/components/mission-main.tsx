import { ASSETS } from "@/lib/assets";
import PageHero from "@/components/layout/PageHero";
import { MissionVision } from "./VisionMission";

export function MissionMain() {
  return (
    <main className="min-h-screen">
      <PageHero title="Mission & Vision" image={ASSETS.vision34} />
      <MissionVision />
    </main>
  );
}
