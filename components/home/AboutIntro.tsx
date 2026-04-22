import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function AboutIntro() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-content">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left - Text */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">ABOUT US</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-text leading-tight">
                A People-Centric Foundation for Social Change
              </h2>
            </div>
            
            <div className="space-y-6 text-text-muted text-[17px] leading-relaxed">
              <p>
                We are a registered non-profit organization committed to building
                an aware, informed, and responsible society. Working at the grassroots
                level, we empower individuals, families, and communities through
                awareness, education, guidance, and support across critical areas of
                social life.
              </p>
              <p>
                By organizing workshops, campaigns, seminars, and outreach programs —
                both online and offline — we strive to bridge the information gap and
                help citizens make informed, lawful, and safe decisions in their daily lives.
              </p>
            </div>

            <Link 
              href="/About" 
              className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-light transition-colors group"
            >
              Learn More About Us
              <MoveRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right - Image */}
          <div className="flex-1 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1931&auto=format&fit=crop" 
                alt="Community Awareness" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Overlay Card */}
            <div className="absolute -bottom-8 -left-8 bg-accent text-white p-6 rounded-xl shadow-xl max-w-[280px] hidden md:block">
              <p className="font-display text-lg font-bold italic leading-snug">
                &quot;Non-Political | Non-Commercial | Awareness-Focused&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
