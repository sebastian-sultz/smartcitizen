import PageHero from "@/components/layout/PageHero";
import { ExpertCard, PartnerDisclaimer } from "@/features/partners";

export default function PartnerPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Partners & Experts" image="/assets/a9.png" />

      <section className="py-24 bg-white">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="font-display text-4xl font-bold text-text">Our Experts & Advisory Support</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Meet our dedicated professionals who guide, empower, and assist individuals
              in diverse areas of need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <ExpertCard 
              title="Dr. Anuj Singh"
              category="Legal Expert"
              quote="Guidance on fundamental rights, consumer law, and legal awareness."
            />
            <ExpertCard 
              title="Mrs. Kavita Rai"
              category="Psychological Expert"
              quote="Behavioral guidance and mental well-being support for communities."
            />
            <ExpertCard 
              title="Mr. Manoj Jain"
              category="Financial Expert"
              quote="Financial literacy and guidance on safe money management."
            />
            <ExpertCard 
              title="Mr. Neeraj Kumar"
              category="Digital & Cyber Expert"
              quote="Awareness on cyber fraud prevention and safe internet practices."
            />
          </div>

          <PartnerDisclaimer />
        </div>
      </section>
    </main>
  );
}
