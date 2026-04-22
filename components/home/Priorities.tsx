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

export default function Priorities() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-content">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary">CORE FOCUS</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Our Priorities</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            We focus on these six pillars to create a balanced and informed society.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {priorities.map((item, i) => (
            <div key={i} className="group relative p-8 rounded-[32px] bg-bg border border-border hover:border-primary/20 hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-[0.03] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />
              
              <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white mb-8 shadow-lg shadow-black/5`}>
                <item.icon size={28} />
              </div>

              <h3 className="font-display text-2xl font-bold text-text mb-4 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-text-muted leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
