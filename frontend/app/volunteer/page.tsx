import PageHero from "@/components/layout/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { UserCheck } from "lucide-react";
import Link from "next/link";

export default function VolunteerProgramsPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Volunteer Programs" image="/assets/s1.jpeg" />
      <section className="py-16 md:py-24 bg-bg">
        <div className="max-content">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">JOIN THE MOVEMENT</span>
            <h2 className="font-display text-4xl font-bold text-text">Volunteer Programs</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Meet our dedicated volunteers working together to create positive social change.
            </p>
          </div>
          <EmptyState 
            icon={UserCheck}
            title="Volunteer Spotlight Coming Soon"
            description="We are currently profiling our incredible team of volunteers. Want to be featured here?"
            ctaText="Register as a Volunteer"
            ctaHref="/JoinUs"
          />

          <div className="mt-24 bg-primary text-white rounded-[40px] p-12 text-center space-y-8">
            <h3 className="font-display text-3xl font-bold">Want to Make a Difference?</h3>
            <p className="text-white/70 max-w-xl mx-auto">
              Become a part of our growing family of volunteers and help us
              create lasting impact in communities across India.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Link href="/JoinUs" className="bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-accent/20">
                  Join as a Volunteer
               </Link>
               <Link href="/term" className="border border-white/20 hover:bg-white/10 text-white px-8 py-3 rounded-xl font-bold transition-all">
                  View Terms & Guidelines
               </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
