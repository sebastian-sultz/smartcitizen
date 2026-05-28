import PageHero from "@/components/layout/PageHero";
import { NeedHelpDirectory } from "@/features/need-help";

export default function NeedHelpPage() {
  return (
    <main className="min-h-screen bg-bg">
      <PageHero title="Community Support & Help" image="/assets/a1.png" />

      <section className="py-12 md:py-16">
        <div className="max-content max-w-5xl mx-auto">
          <NeedHelpDirectory />
        </div>
      </section>
    </main>
  );
}


