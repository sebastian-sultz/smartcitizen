import PageHero from "@/components/layout/PageHero";
import { Trophy } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Participation Highlights" />

      <section className="py-24 bg-white">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">RECOGNITION</span>
            <h2 className="font-display text-4xl font-bold text-text">Participation Highlights</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Explore highlights of participant involvement, success stories, and
              community impact across activities.
            </p>

            {/* Empty State */}
            <div className="mt-16 bg-bg border-2 border-dashed border-border rounded-[40px] p-16 space-y-6">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary opacity-30">
                <Trophy size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-text-muted">Highlights coming soon</h3>
                <p className="text-text-light max-w-sm mx-auto">Be the first to participate in our upcoming programs and get featured here!</p>
              </div>
              <div className="pt-6 flex flex-wrap justify-center gap-4">
                <Link href="/playquize" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light transition-all">
                  Take the Quiz
                </Link>
                <Link href="/JoinUs" className="border-2 border-primary text-primary px-8 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-all">
                  Join as a Volunteer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
