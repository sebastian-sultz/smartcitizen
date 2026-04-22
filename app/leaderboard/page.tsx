import PageHero from "@/components/layout/PageHero";
import { LeaderboardHighlights } from "@/features/leaderboard";

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Participation Highlights" image="/assets/q8.jpeg" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">RECOGNITION</span>
            <h2 className="font-display text-4xl font-bold text-text">Participation Highlights</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Explore highlights of participant involvement, success stories, and community impact across activities.
            </p>
            <LeaderboardHighlights />
          </div>
        </div>
      </section>
    </main>
  );
}
