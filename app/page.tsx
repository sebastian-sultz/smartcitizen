import Hero from "@/components/home/Hero";
import ImpactCounter from "@/components/home/ImpactCounter";
import AboutIntro from "@/components/home/AboutIntro";
import ProgramSection from "@/components/home/ProgramSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ImpactSection from "@/components/home/ImpactSection";
import TeamSection from "@/components/home/TeamSection";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import DonationCTA from "@/components/home/DonationCTA";
import CommunitySports from "@/components/home/CommunitySports";

export default function Home() {
  return (
    <main>
      <Hero />
      <ImpactCounter />
      <AboutIntro />
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
