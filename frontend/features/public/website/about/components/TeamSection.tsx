import { ASSETS } from "@/lib/assets";
import Image from "next/image";

const teamMembers = [
  { name: "Dr. Anuj Singh", role: "Legal Advisor / Staff", img: ASSETS.a4 },
  { name: "Mrs. Kavita Rai", role: "Community Well-being Lead", img: ASSETS.a1 },
  { name: "Mr. Manoj Jain", role: "Financial Literacy Contributor", img: ASSETS.a11 },
  { name: "Mr. Neeraj Kumar", role: "Digital Safety Contributor", img: ASSETS.a10 },
];

export function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-content">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">OUR LEADERSHIP</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Meet the Leadership Behind the Mission</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <div key={i} className="group cursor-default">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 shadow-card group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <Image 
                  src={member.img} 
                  alt={member.name} 
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
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
