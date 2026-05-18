import { Trophy } from "lucide-react";

export default function CommunitySports() {
  return (
    <section className="py-16 md:py-24 bg-dark text-white overflow-hidden">
      <div className="max-content">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left - Text */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">COMMUNITY INITIATIVE</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white">Battle of Champions</h2>
            </div>
            
            <p className="text-white/70 text-[18px] leading-relaxed">
              Battle of Champions brings together cricket teams to compete with passion,
              skill, and determination, creating thrilling matches and unforgettable
              moments on the field.
            </p>

            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <h4 className="font-display text-xl font-bold text-accent mb-3 flex items-center gap-2">
                  <Trophy size={20} />
                  Community Cricket Development Drive
                </h4>
                <p className="text-white/60 text-[15px] leading-relaxed">
                  GlobalSmart Citizens Foundation organizes inclusive cricket tournaments to
                  promote youth engagement, teamwork, discipline, and community bonding while
                  nurturing local sporting talent.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <h4 className="font-display text-xl font-bold text-accent mb-3 flex items-center gap-2">
                  <Trophy size={20} />
                  Empowering Youth Through Cricket
                </h4>
                <p className="text-white/60 text-[15px] leading-relaxed">
                  These tournaments create opportunities for young players to showcase skills,
                  build confidence, encourage healthy competition, and strengthen unity across
                  diverse communities.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Images */}
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
               <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-2xl">
                  <img 
                    src="/assets/a23.jpeg" 
                    alt="Cricket Match" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                  />
               </div>
            </div>
            <div className="space-y-4">
               <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-2xl">
                  <img 
                    src="/assets/a26.jpeg" 
                    alt="Team Trophy" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
