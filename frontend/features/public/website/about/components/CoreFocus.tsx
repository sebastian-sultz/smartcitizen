import { HeartHandshake, Scale, ShieldCheck, Heart, Vote, GraduationCap } from "lucide-react";

const priorities = [
  {
    title: "Charitable Support",
    desc: "Providing guidance, counseling, and essential support to individuals in distress or facing social challenges.",
    icon: HeartHandshake,
    color: "bg-red-500",
  },
  {
    title: "Legal & Constitutional Awareness",
    desc: "Educating citizens on their fundamental rights, duties, and the legal framework for a more just society.",
    icon: Scale,
    color: "bg-blue-600",
  },
  {
    title: "Digital & Cyber Awareness",
    desc: "Spreading awareness about cyber fraud prevention, internet safety, and ethical digital behavior.",
    icon: ShieldCheck,
    color: "bg-indigo-600",
  },
  {
    title: "Health & Wellness",
    desc: "Organizing camps and workshops focused on mental health, women's hygiene, and overall social well-being.",
    icon: Heart,
    color: "bg-rose-500",
  },
  {
    title: "Voting Rights & Civic Duty",
    desc: "Encouraging democratic participation and educating citizens on the importance of every single vote.",
    icon: Vote,
    color: "bg-orange-600",
  },
  {
    title: "Education & Student Growth",
    desc: "Guiding students through career counseling, stress management, and skill-building opportunities.",
    icon: GraduationCap,
    color: "bg-emerald-600",
  },
];

export function CoreFocus() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-content">
        <div className="text-center mb-8 md:mb-10 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary">CORE FOCUS</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Our Priorities</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            We focus on these six pillars to create a balanced and informed society.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {priorities.map((item, i) => (
            <div key={i} className="group relative p-6 md:p-8 rounded-2xl md:rounded-[32px] bg-bg border border-border hover:border-primary/20 hover:shadow-2xl transition-all duration-500 overflow-hidden flex gap-5">
              {/* Colored Accent Strip */}
              <div className={`w-1 md:w-1.5 self-stretch rounded-full ${item.color} shrink-0`} />
              
              {/* Large low-opacity blurred background watermark */}
              <div className="absolute -bottom-8 -right-8 pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-x-3 group-hover:-translate-y-3 z-0">
                <item.icon className={`size-32 md:size-40 ${item.color.replace("bg-", "text-")} opacity-[0.06]`} />
              </div>

              {/* Content Container */}
              <div className="relative z-10 flex-1 space-y-2 md:space-y-3">
                <h3 className="font-display text-lg md:text-2xl font-bold text-text group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm md:text-base leading-relaxed pr-6 md:pr-10">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
