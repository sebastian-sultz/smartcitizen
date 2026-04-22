import PageHero from "@/components/layout/PageHero";
import { Calendar, MapPin, Info } from "lucide-react";

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Upcoming Programs" />

      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">WHAT&apos;S COMING</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Upcoming Programs & Events</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Discover upcoming events and join us to make a positive difference together.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Real Event: Women Sports Tournament */}
            <div className="bg-white rounded-[40px] overflow-hidden shadow-card hover:shadow-2xl transition-all group flex flex-col md:flex-row">
              <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1541252260730-0412e3e21079?q=80&w=1948&auto=format&fit=crop" 
                  alt="Women Sports" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-accent text-white px-4 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider shadow-lg">
                  Proposed Initiative
                </div>
              </div>
              <div className="md:w-3/5 p-8 md:p-10 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-text group-hover:text-primary transition-colors">
                    Women Sports Tournament
                  </h3>
                  <p className="text-text-muted text-[15px] leading-relaxed">
                    GlobalSmart Citizens Foundation is planning to organize a Women Sports Tournament as part of its commitment to promoting women empowerment, health, and equal opportunities in society.
                  </p>
                  <p className="text-text-muted text-[15px] leading-relaxed">
                    This initiative aims to encourage women to actively participate in sports, build confidence, and showcase their talent at a wider platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-border">
                  <div className="flex items-center gap-3 text-[14px] text-text-muted">
                    <Calendar size={18} className="text-primary" />
                    <span>Details Coming Soon</span>
                  </div>
                  <div className="flex items-center gap-3 text-[14px] text-text-muted">
                    <MapPin size={18} className="text-primary" />
                    <span>To Be Announced</span>
                  </div>
                </div>

                <div className="bg-bg p-4 rounded-xl flex items-start gap-3 border border-primary/10">
                   <Info size={18} className="text-primary shrink-0 mt-0.5" />
                   <p className="text-[13px] text-primary/80 font-medium">
                     Proposed Initiative — Further details regarding participation and schedule will be shared soon.
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Stay Updated */}
          <div className="mt-24 max-w-4xl mx-auto bg-primary text-white rounded-[40px] p-12 md:p-16 text-center space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                <Calendar size={160} />
             </div>
             <div className="relative z-10 space-y-6">
                <h3 className="font-display text-3xl md:text-4xl font-bold">Stay Updated with Our Programs</h3>
                <p className="text-white/70 max-w-lg mx-auto">
                  Subscribe to our newsletter or follow us on social media to get instant updates about our community initiatives.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                   <input type="email" placeholder="Your email address" className="px-6 py-3 rounded-xl bg-white text-text outline-none w-full md:w-80 shadow-lg" />
                   <button className="bg-accent hover:bg-accent-light text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg shadow-accent/20">Subscribe</button>
                </div>
             </div>
          </div>
        </div>
      </section>

    </main>
  );
}
