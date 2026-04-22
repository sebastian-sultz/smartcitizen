import PageHero from "@/components/layout/PageHero";
import { Search, Calendar, User, ArrowRight } from "lucide-react";

export default function BlogsPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Awareness Blogs" />

      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">KNOWLEDGE HUB</span>
            <h2 className="font-display text-4xl font-bold text-text">Awareness Blogs</h2>
            <p className="text-text-muted text-[17px] max-w-2xl mx-auto">
              Read awareness blogs sharing insights, knowledge, and inspiring stories
              for social change.
            </p>
          </div>

          {/* Search & Filter (Static UI) */}
          <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
              <input 
                type="text" 
                placeholder="Search awareness topics..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {["All", "Environment", "Legal", "Digital", "Health"].map((cat, i) => (
                <button key={i} className={`px-5 py-2 rounded-full text-[14px] font-bold whitespace-nowrap transition-all ${i === 0 ? "bg-primary text-white" : "bg-white text-text-muted hover:bg-primary/5 border border-border"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CMS Placeholder Cards */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all group flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-bg">
                  {/* Placeholder Image */}
                  <div className="w-full h-full flex items-center justify-center text-text-light/20">
                     <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  </div>
                  <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    Awareness
                  </div>
                </div>
                <div className="p-8 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[13px] text-text-light">
                    <span className="flex items-center gap-1"><Calendar size={14} /> July 2026</span>
                    <span className="flex items-center gap-1"><User size={14} /> Admin</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-2">
                    Coming Soon: Inspiring Knowledge for Social Empowerment
                  </h3>
                  <p className="text-text-muted text-[15px] leading-relaxed line-clamp-3">
                    We are currently preparing insightful articles to help you stay informed and empowered. Check back soon for our first series of awareness blogs.
                  </p>
                  <div className="pt-4 mt-auto">
                    <button className="flex items-center gap-2 font-bold text-primary opacity-50 cursor-not-allowed">
                      Read More <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State Message */}
          <div className="mt-16 text-center p-12 bg-surface rounded-[40px] border border-border">
            <h3 className="font-display text-2xl font-bold text-text mb-2">Our Blog is Launching Soon</h3>
            <p className="text-text-muted max-w-lg mx-auto">We are working with experts to bring you the most accurate and helpful awareness content. Subscribe to our newsletter to get notified.</p>
          </div>
        </div>
      </section>

    </main>
  );
}
