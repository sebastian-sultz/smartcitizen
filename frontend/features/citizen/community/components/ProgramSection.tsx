import { Leaf, Shield, Scale, Heart, Baby, BookOpen, MoveRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

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

export function ProgramSection() {
  return (
    <section className="py-12 md:py-16 bg-bg">
      <div className="max-content">
        <div className="text-center mb-8 md:mb-10 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">OUR PROGRAMS</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text">What We Stand For</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            We work across 15 key social dimensions to build informed, safe, and empowered communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredPrograms.map((program, i) => (
            <div 
              key={i} 
              className="group bg-white p-3 rounded-2xl border border-border/60 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              {/* Icon and Title Row */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <program.icon size={22} strokeWidth={2} />
                </div>
                <h3 className="font-display text-lg font-bold text-text group-hover:text-primary transition-colors leading-tight">
                  {program.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-text-muted text-sm leading-relaxed pl-1">
                {program.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-10 text-center">
          <Button 
            asChild
            variant="outline"
            size={"sm"}   
            endIcon={<MoveRight size={20} />}
          >
            <Link href="/our_work">
              View All 15 Programs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
