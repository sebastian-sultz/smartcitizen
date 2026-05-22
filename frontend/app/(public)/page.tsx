import { Hero, MediaPresence } from "@/features/home";
import {
  PartnerMarquee,
  AboutIntro,
  CoreFocus,
  WhyChooseUs,
} from "@/features/about";
import { ImpactCounter } from "@/features/impact";
import {
  ProgramSection,
  UpcomingEvents,
  LatestActivities,
} from "@/features/community";
import { DonationCTA } from "@/features/donation";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PartnerMarquee />
      <AboutIntro />
      <CoreFocus />
      <ProgramSection />
      <ImpactCounter />
      <LatestActivities />
      <UpcomingEvents />
      <WhyChooseUs />
      <DonationCTA />
      <MediaPresence />
    </main>
  );
}

