import PageHero from "@/components/layout/PageHero";
import { MissionVision } from "@/features/mission";

export default function MissionPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Mission & Vision" image="/assets/vision34.jpeg" />
      <MissionVision />
    </main>
  );
}
