import { Scale, Shield, Heart, Baby, Wallet, UserCheck, Leaf, BookOpen, HandHeart } from "lucide-react";

const impactItems = [
  { icon: Scale, text: "Helping citizens understand legal rights, duties, and protections" },
  { icon: Shield, text: "Educating people on digital safety, cyber fraud prevention, and online responsibility" },
  { icon: Heart, text: "Promoting health awareness, mental well-being, women's health, and preventive care" },
  { icon: Baby, text: "Protecting children through child rights, safety, and POCSO awareness" },
  { icon: Wallet, text: "Encouraging financial literacy for safer household money management" },
  { icon: UserCheck, text: "Supporting senior citizens with legal, digital, and financial awareness" },
  { icon: Leaf, text: "Creating environmentally responsible communities through sustainability programs" },
  { icon: BookOpen, text: "Guiding students with career awareness, stress management, and skill development" },
  { icon: HandHeart, text: "Providing charitable support, counseling, and guidance during times of need" },
];

export default function ImpactSection() {
  return (
    <section className="py-24 bg-primary">
      <div className="max-content">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent-light">OUR IMPACT</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">How We Are Changing People&apos;s Lives</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactItems.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border-l-4 border-accent flex items-start gap-4 hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                <item.icon size={20} />
              </div>
              <p className="text-text font-medium text-[15px] leading-snug pt-1">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
