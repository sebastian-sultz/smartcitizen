import { Scale, Shield, Heart, Baby, Wallet, UserCheck, Leaf, BookOpen, HandHeart } from "lucide-react";

const impactItems = [
  { 
    icon: Scale, 
    title: "Legal & Constitutional Awareness",
    text: "Empowering citizens with knowledge of their fundamental rights, duties, and essential legal protections like FIR and Consumer Laws." 
  },
  { 
    icon: Shield, 
    title: "Digital & Cyber Safety",
    text: "Educating communities on cyber fraud prevention, safe internet usage, and responsible social media ethics for a secure digital life." 
  },
  { 
    icon: Heart, 
    title: "Health & Mental Well-being",
    text: "Promoting overall wellness through yoga, nutrition guidance, mental health awareness, and hygiene camps for all age groups." 
  },
  { 
    icon: Baby, 
    title: "Child Protection & Safety",
    text: "Safeguarding the future through POCSO awareness, child rights education, and building secure environments for children to thrive." 
  },
  { 
    icon: Wallet, 
    title: "Financial Literacy",
    text: "Guiding households towards financial security through awareness on banking, savings, and safe money management practices." 
  },
  { 
    icon: UserCheck, 
    title: "Senior Citizen Support",
    text: "Providing dedicated legal, digital, and emotional support to help our elders live with dignity, safety, and technological confidence." 
  },
  { 
    icon: Leaf, 
    title: "Environmental Responsibility",
    text: "Driving grassroots action for waste segregation, plastic-free living, and sustainable practices to protect our planet." 
  },
  { 
    icon: BookOpen, 
    title: "Education & Career Guidance",
    text: "Bridging the information gap for students with career counseling, scholarship awareness, and professional skill development." 
  },
  { 
    icon: HandHeart, 
    title: "Social Welfare & Support",
    text: "Standing with individuals in need through counseling, guidance, and charitable assistance for holistic community development." 
  },
];

export default function ImpactSection() {
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="max-content">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent-light">OUR IMPACT</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">How We Are Changing People&apos;s Lives</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactItems.map((item, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-[32px] border border-white/10 flex flex-col gap-6 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform">
                <item.icon size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-accent-light transition-colors">{item.title}</h3>
                <p className="text-white/70 text-[15px] leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
