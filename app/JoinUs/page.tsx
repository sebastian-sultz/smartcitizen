import PageHero from "@/components/layout/PageHero";
import { CheckCircle2 } from "lucide-react";
import { VolunteerForm } from "@/features/volunteer";

export default function JoinUsPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Join as a Volunteer" image="/assets/s1.jpeg" />

      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left - Why Join */}
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">MAKE AN IMPACT</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Become a Smart Citizen</h2>
                <p className="text-text-muted text-[18px] leading-relaxed">
                  Join a growing movement of aware, responsible, and empowered volunteers
                  who are making real differences in communities across India.
                </p>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                    <CheckCircle2 size={24} />
                    We Welcome:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Social workers and community volunteers",
                      "Educators, counselors, and trainers",
                      "Legal, digital, and health awareness professionals",
                      "Students and youth volunteers"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-border text-[15px] text-text-muted">
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <VolunteerForm />
          </div>
        </div>
      </section>
    </main>
  );
}
