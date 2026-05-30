import PageHero from "@/components/layout/PageHero";
import { OurStory, Priorities, CareerSection } from "./AboutContent";
import { TeamSection } from "./TeamSection";


export function AboutMain() {
  return (
    <main className="min-h-screen">
      <PageHero title="About the Foundation" image="/assets/about_us.jpg" />
      <OurStory />
      <TeamSection />
      <Priorities />
      <CareerSection />
    </main>
  );
}
