import PageHero from "@/components/layout/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

export default function CommunityActivitiesPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Community Activities" />
      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">TOGETHER WE GROW</span>
            <h2 className="font-display text-4xl font-bold text-text">Community Activities</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Explore community activities that encourage participation, collaboration,
              and positive local impact.
            </p>
          </div>
          <EmptyState 
            icon={Users}
            title="Activities Coming Soon"
            description="We are currently organizing new community activities. Be the first to join our next event!"
            ctaText="Join as a Volunteer"
            ctaHref="/JoinUs"
          />
        </div>
      </section>
    </main>
  );
}
