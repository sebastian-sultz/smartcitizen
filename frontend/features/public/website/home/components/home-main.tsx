import { Hero } from "./Hero";
import { MediaPresence } from "./MediaPresence";
import {
  PartnerMarquee,
  AboutIntro,
  CoreFocus,
  WhyChooseUs,
} from "@/features/public/website/about";
import {
  ProgramSection,
  UpcomingEvents,
} from "@/features/citizen/community";
import { DonationCTA } from "@/features/public/donation";

export function HomeMain() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PartnerMarquee />
      <AboutIntro />
      <CoreFocus />
      <ProgramSection />
      <UpcomingEvents />
      <WhyChooseUs />
      <DonationCTA />
      <MediaPresence />
    </main>
  );
}
