import { Hero, MediaPresence } from "@/features/public/website/home";
import {
  PartnerMarquee,
  AboutIntro,
  CoreFocus,
  WhyChooseUs,
} from "@/features/public/website/about";
import {
  ProgramSection,
  UpcomingEvents,
  LatestActivities,
} from "@/features/citizen/community";
import { DonationCTA } from "@/features/public/donation";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PartnerMarquee />
      <AboutIntro />
      <CoreFocus />
      <ProgramSection />
      <LatestActivities />
      <UpcomingEvents />
      <WhyChooseUs />
      <DonationCTA />
      <MediaPresence />
    </main>
  );
}

