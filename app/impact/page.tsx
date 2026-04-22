import PageHero from "@/components/layout/PageHero";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { ImpactStories } from "@/features/impact";

export default function ImpactPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Our Social Impact" image="/assets/vision34.jpeg" />

      {/* Impact Statement */}
      <section className="py-24 bg-white">
        <div className="max-content">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">MAKING A DIFFERENCE</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text leading-tight">
              Driving Change Across Communities
            </h2>
            <div className="space-y-6 text-text-muted text-[19px] leading-relaxed">
              <p>
                We are driving the pressing movement toward the future we all need.
                We are solving and ensuring awareness on clean environment, digital safety,
                legal rights, and overall social well-being for communities across India.
              </p>
              <p>
                Around the world, we connect individuals, schools, groups, and communities —
                empowering people with vision and creating new opportunities for positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      
      <ImpactStories />
    </main>
  );
}
