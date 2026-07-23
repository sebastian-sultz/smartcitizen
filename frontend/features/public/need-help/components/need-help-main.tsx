import { ASSETS } from "@/lib/assets";
import PageHero from "@/components/layout/PageHero";
import { NeedHelpDirectory } from "./NeedHelpDirectory";

export function NeedHelpMain() {
  return (
    <main className="min-h-screen bg-bg">
      <PageHero title="Community Support & Help" image={ASSETS.a1} />

      <section className="py-12 md:py-16">
        <div className="max-content max-w-5xl mx-auto">
          <NeedHelpDirectory />
        </div>
      </section>
    </main>
  );
}
