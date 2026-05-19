import PageHero from "@/components/layout/PageHero";
import { OurStory, Priorities, CareerSection, TeamSection } from "@/features/about";

export default function AboutPage() {
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
