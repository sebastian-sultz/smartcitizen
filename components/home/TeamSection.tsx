const teamMembers = [
  { name: "ALEXANDER GARY", role: "Founder", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
  { name: "MELISSA MUNOZ", role: "Co-Founder", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop" },
  { name: "JOHN ABRAHAM", role: "Chief Editor", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" },
  { name: "SILVIA STAN", role: "Manager", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1974&auto=format&fit=crop" },
];

export default function TeamSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-content">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">OUR LEADERSHIP</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Meet the Experts Behind the Mission</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <div key={i} className="group cursor-default">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-card group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h3 className="font-display text-xl font-bold text-text mb-1">{member.name}</h3>
                <p className="text-[12px] font-bold uppercase tracking-widest text-text-light">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
