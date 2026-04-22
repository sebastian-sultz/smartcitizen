import PageHero from "@/components/layout/PageHero";
import TeamSection from "@/components/home/TeamSection";
import { TreePine, Zap, Droplets, Wind, CloudSun, Recycle } from "lucide-react";
import Link from "next/link";

const priorities = [
  { icon: TreePine, title: "Stop Cutting Down Trees" },
  { icon: Zap, title: "Be Efficient in Energy Use" },
  { icon: Droplets, title: "Being Water Wise at Home" },
  { icon: Wind, title: "Preventing Air Pollution" },
  { icon: CloudSun, title: "Reducing Greenhouse Gas" },
  { icon: Recycle, title: "Recycling the Daily Waste" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="About the Foundation" />

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="max-content">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">WHO WE ARE</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-text">About GlobalSmart Citizens Foundation</h2>
              </div>
              <div className="space-y-6 text-text-muted text-[17px] leading-relaxed">
                <p>
                  We are a people-centric, non-profit organization committed to building
                  an aware, informed, and responsible society. Our Foundation works at
                  the grassroots level to empower individuals, families, and communities
                  through awareness, education, guidance, and support across critical areas
                  of social life.
                </p>
                <p>
                  Our initiatives focus on environmental responsibility, health & wellness,
                  digital and cyber safety, legal and constitutional awareness, child
                  protection, education, financial literacy, civic sense, and social ethics.
                  We believe that true social change begins with awareness and sustained
                  community participation.
                </p>
                <p>
                  By organizing workshops, campaigns, seminars, outreach programs, and
                  support initiatives — both online and offline — we strive to bridge the
                  information gap and help citizens make informed, lawful, and safe decisions
                  in their daily lives.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src="/assets/about_us.jpg" alt="Foundation Work" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <TeamSection />

      {/* Our Priorities */}
      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">OUR PRIORITIES</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Our Environmental Commitment</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {priorities.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-card border-b-4 border-primary/20 hover:border-primary transition-all group text-center">
                <div className="w-16 h-16 rounded-full bg-primary/5 text-primary flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <item.icon size={32} />
                </div>
                <h3 className="font-display text-xl font-bold text-text">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career With Us */}
      <section className="py-24 bg-surface">
        <div className="max-content">
          <div className="bg-primary rounded-[32px] p-8 md:p-16 text-white overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent-light mb-4 block text-center lg:text-left">JOIN OUR MISSION</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-12 text-center lg:text-left">Career With Us</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-accent-light border-b border-white/10 pb-4">We Welcome:</h4>
                  <ul className="space-y-4 text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      Social workers and community volunteers
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      Educators, counselors, and trainers
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      Legal, digital, and health awareness professionals
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      Students and youth volunteers passionate about social change
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-accent-light border-b border-white/10 pb-4">Working With Us Offers:</h4>
                  <ul className="space-y-4 text-white/80">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      Meaningful social impact
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      Learning and leadership opportunities
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      Community recognition
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      A chance to contribute to nation-building at the grassroots level
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-16 text-center">
                <Link href="/JoinUs" className="inline-block bg-accent hover:bg-accent-light text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-accent/20">
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
