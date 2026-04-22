import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function AboutIntro() {
  return (
    <section className="py-16 md:py-24 bg-surface">
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
            <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/assets/about_us.jpg" 
                alt="Community Awareness Workshop" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Overlay Card */}
            <div className="absolute -bottom-10 -left-10 bg-accent text-white p-8 rounded-3xl shadow-2xl max-w-[300px] hidden xl:block border-4 border-white">
              <p className="font-display text-xl font-black italic leading-tight">
                &quot;Knowledge is the strongest tool for social development.&quot;
              </p>
              <div className="mt-4 flex gap-2">
                <span className="w-8 h-1 bg-white/30 rounded-full" />
                <span className="w-4 h-1 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
