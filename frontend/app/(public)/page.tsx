import { Hero } from "@/features/home";
import { PartnerMarquee, AboutIntro, CoreFocus, WhyChooseUs, TeamSection } from "@/features/about";
import { ImpactCounter, ImpactSection } from "@/features/impact";
import { ProgramSection, UpcomingEvents, CommunitySports } from "@/features/community";
import { DonationCTA } from "@/features/donation";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PartnerMarquee />
      <ImpactCounter />
      <AboutIntro />
      <CoreFocus />
      <ProgramSection />
      <WhyChooseUs />
      <ImpactSection />
      <TeamSection />
      <UpcomingEvents />
      <DonationCTA />
      <CommunitySports />
    </main>
  );
}
