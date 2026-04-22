const teamMembers = [
  { name: "Dr. Anuj Singh", role: "Legal Expert", img: "/assets/a4.png" },
  { name: "Mrs. Kavita Rai", role: "Psychological Expert", img: "/assets/a1.png" },
  { name: "Mr. Manoj Jain", role: "Financial Expert", img: "/assets/a11.png" },
  { name: "Mr. Neeraj Kumar", role: "Digital & Cyber Expert", img: "/assets/a10.png" },
];

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-surface">
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
