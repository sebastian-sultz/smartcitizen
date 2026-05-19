import PageHero from "@/components/layout/PageHero";
import { NeedHelpDirectory } from "@/features/need-help";

export default function NeedHelpPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Community Support & Help" image="/assets/a1.png" />

      <section className="py-16 md:py-24 bg-bg">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">SUPPORT DIRECTORY</span>
            <h2 className="font-display text-4xl font-bold text-text">Find the Help You Need</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Connect with verified volunteers, professionals, and community leaders who have offered their time and expertise to support citizens.
            </p>
          </div>

          <NeedHelpDirectory />
        </div>
      </section>
    </main>
  );
}
