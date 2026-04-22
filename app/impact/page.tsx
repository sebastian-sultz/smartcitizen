import PageHero from "@/components/layout/PageHero";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function ImpactPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Our Social Impact" />

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

      {/* Reusing WhyChooseUs for Impact differentiation */}
      <WhyChooseUs />

      {/* Placeholder for Case Studies / Success Stories */}
      <section className="py-24 bg-surface">
        <div className="max-content">
           <div className="bg-bg p-12 rounded-[40px] border-2 border-dashed border-border text-center space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-text-muted">Impact Stories Coming Soon</h3>
              <p className="text-text-light max-w-md mx-auto">We are currently documenting our grassroots success stories. Stay tuned to read how awareness is transforming lives.</p>
           </div>
        </div>
      </section>

    </main>
  );
}
