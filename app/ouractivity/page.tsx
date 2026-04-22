import PageHero from "@/components/layout/PageHero";
import EmptyState from "@/components/ui/EmptyState";
import { Camera } from "lucide-react";

export default function OurActivityPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Our Activities" image="/assets/vision34.jpeg" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { src: "/assets/a1.png", title: "Environmental Awareness Workshop" },
              { src: "/assets/a2.png", title: "Digital Literacy Campaign" },
              { src: "/assets/a3.png", title: "Community Health Camp" },
              { src: "/assets/a4.png", title: "Legal Rights Seminar" },
              { src: "/assets/a5.png", title: "Student Guidance Program" },
              { src: "/assets/a6.png", title: "Women Empowerment Drive" },
              { src: "/assets/a23.jpeg", title: "Battle of Champions Cricket" },
              { src: "/assets/a26.jpeg", title: "Cricket Trophy Distribution" },
              { src: "/assets/s1.jpeg", title: "Volunteer Recognition Event" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="group relative rounded-[32px] overflow-hidden aspect-[4/3] bg-surface shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <span className="text-accent-light text-[10px] font-black uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">GlobalSmart Action</span>
                  <h3 className="text-white font-display text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
