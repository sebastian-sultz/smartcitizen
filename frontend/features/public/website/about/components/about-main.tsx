import { ASSETS } from "@/lib/assets";
import PageHero from "@/components/layout/PageHero";
import { OurStory, Priorities, CareerSection } from "./AboutContent";
import { TeamSection } from "./TeamSection";


export function AboutMain() {
  return (
    <main className="min-h-screen">
      <PageHero title="About the Foundation" image={ASSETS.aboutUs} />
      <OurStory />
      <TeamSection />
      <Priorities />
      <CareerSection />
    </main>
  );
}
