import { Leaf, Shield, Scale, Heart, Baby, BookOpen, MoveRight } from "lucide-react";
import Link from "next/link";

const featuredPrograms = [
  {
    icon: Leaf,
    title: "Environmental Awareness",
    desc: "Plastic-free living, water conservation, sustainability",
  },
  {
    icon: Shield,
    title: "Digital & Cyber Awareness",
    desc: "Cyber fraud prevention, safe internet, online safety",
  },
  {
    icon: Scale,
    title: "Legal & Constitutional Awareness",
    desc: "Rights, duties, FIR, consumer law",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    desc: "Nutrition, mental health, women's health, preventive care",
  },
  {
    icon: Baby,
    title: "Child Protection",
    desc: "POCSO, child rights, safe internet for children",
  },
  {
    icon: BookOpen,
    title: "Education & Student Awareness",
    desc: "Career guidance, scholarships, stress management",
  },
];

export default function ProgramSection() {
  return (
    <section className="py-24 bg-bg">
      <div className="max-content">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">OUR PROGRAMS</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text">What We Stand For</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            We work across 15 key social dimensions to build informed, safe, and empowered communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPrograms.map((program, i) => (
            <div 
              key={i} 
              className="bg-white p-8 rounded-xl shadow-card border-l-4 border-transparent hover:border-primary hover:-translate-y-1 transition-all duration-300 group cursor-default"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <program.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-bold mb-3 text-text group-hover:text-primary transition-colors">
                {program.title}
              </h3>
              <p className="text-text-muted text-[15px] leading-relaxed">
                {program.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/ourwork" 
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
          >
            View All 15 Programs
            <MoveRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
