import PageHero from "@/components/layout/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { Camera } from "lucide-react";

export default function OurActivityPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Our Activities" />
      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">ON THE GROUND</span>
            <h2 className="font-display text-4xl font-bold text-text">Our Activities</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Explore our activities focused on community development, education,
              and social impact.
            </p>
          </div>
          <EmptyState 
            icon={Camera}
            title="Gallery Coming Soon"
            description="We are documenting our latest ground activities. Check back soon for photos and stories."
            ctaText="Support Our Cause"
            ctaHref="/donation"
          />
        </div>
      </section>
    </main>
  );
}
