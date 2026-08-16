import { ASSETS } from "@/lib/assets";
import PageHero from "@/components/layout/PageHero";
import { 
  Leaf, Heart, Shield, Scale, Baby, Vote, ShoppingBag, 
  BookOpen, Car, UserCheck, Wallet, Users, Home, Megaphone, HandHeart 
} from "lucide-react";

const programs = [
  {
    icon: Leaf,
    title: "Environmental Awareness",
    desc: "We promote environmental responsibility by encouraging plastic-free lifestyles, tree plantation drives, water conservation, cleanliness initiatives, waste segregation, and awareness about climate change. Our goal is to build sustainable habits that protect nature for future generations."
  },
  {
    icon: Heart,
    title: "Health & Wellness Awareness",
    desc: "Our health programs focus on nutrition education, mental health awareness, women's health, menstrual hygiene, lifestyle disease prevention, first-aid education, yoga, and holistic well-being to improve overall quality of life."
  },
  {
    icon: Shield,
    title: "Digital, Cyber & Technology Awareness",
    desc: "We educate citizens on cyber fraud prevention, safe digital payments, fake app identification, social media responsibility, online privacy, AI basics, and responsible internet usage to ensure digital safety in a fast-changing world."
  },
  {
    icon: Scale,
    title: "Legal & Constitutional Awareness",
    desc: "Our legal awareness initiatives help people understand fundamental rights and duties, FIR procedures, arrest rules, women and child protection laws, consumer rights, RTI process, traffic laws, and the structure of the court system."
  },
  {
    icon: Baby,
    title: "Child Protection & Child Rights Awareness",
    desc: "We work to safeguard children by spreading awareness about child rights, POCSO Act, prevention of child labour, good touch–bad touch education, child helpline services, and safe internet practices for children."
  },
  {
    icon: Vote,
    title: "Voting Rights & Civic Awareness",
    desc: "We promote voter education, registration awareness, understanding of EVM/VVPAT, NOTA, ethical voting, and the role of the Election Commission — strictly in a neutral and non-political manner."
  },
  {
    icon: ShoppingBag,
    title: "Digital Consumer & Online Shopping Awareness",
    desc: "Our programs help consumers identify fake products, understand refund and return rights, prevent online fraud, value digital invoices, and use grievance redressal mechanisms effectively."
  },
  {
    icon: BookOpen,
    title: "Education & Student Awareness",
    desc: "We guide students through career counseling, scholarship awareness, exam stress management, skill development, digital learning tools, and academic planning to help them achieve their potential."
  },
  {
    icon: Car,
    title: "Road Safety & Civic Sense",
    desc: "We encourage responsible road behavior by promoting traffic rules, helmet and seatbelt usage, pedestrian rights, emergency response basics, and overall civic responsibility in public spaces."
  },
  {
    icon: UserCheck,
    title: "Senior Citizen Welfare & Awareness",
    desc: "Our initiatives support senior citizens by spreading awareness about legal rights, pension schemes, social security benefits, digital literacy, fraud protection, and financial safety."
  },
  {
    icon: Wallet,
    title: "Financial Literacy (Basic)",
    desc: "We educate families on savings versus spending, UPI safety, basic banking knowledge, loans, insurance awareness (non-promotional), and household financial management for stable living."
  },
  {
    icon: Users,
    title: "Social Values & Ethics",
    desc: "We promote gender equality, anti-discrimination, civic responsibility, community harmony, moral values, and responsible citizenship to strengthen social unity."
  },
  {
    icon: Home,
    title: "Marriage, Family & Relationship Awareness",
    desc: "Our programs address marriage-related legal rights, divorce and remarriage awareness, family financial planning, domestic harmony, and lawful marital practices to strengthen family systems."
  },
  {
    icon: Megaphone,
    title: "Awareness Programs & Community Outreach",
    desc: "We conduct workshops, seminars, webinars, competitions, and community outreach programs — both online and offline — to ensure awareness reaches every section of society."
  },
  {
    icon: HandHeart,
    title: "Charitable Support, Counseling & Guidance",
    desc: "We provide financial support, counseling, and guidance to deserving individuals and families, especially for education, health aid, legal assistance, marriage support, and emergency relief — strictly for charitable purposes."
  }
];

export function OurWorkMain() {
  return (
    <main className="min-h-screen">
      <PageHero title="Our Programs" image={ASSETS.vision34} />

      <section className="py-16 md:py-24 bg-bg">
        <div className="max-content">
          <div className="text-center mb-16 space-y-4">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">WHAT WE DO</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Our Programs & Initiatives</h2>
            <p className="text-text-muted max-w-3xl mx-auto text-[17px]">
              We work across 15 key social dimensions to educate, empower, and uplift
              citizens and communities across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {programs.map((program, i) => (
              <div 
                key={i} 
                className="group relative p-5 md:p-8 rounded-2xl md:rounded-[32px] bg-white border border-border/50 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 overflow-hidden flex gap-5"
              >
                {/* Colored Accent Strip */}
                <div className="w-1 md:w-1.5 self-stretch rounded-full bg-primary shrink-0" />
                
                {/* Large low-opacity background watermark */}
                <div className="absolute -bottom-8 -right-8 pointer-events-none transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-x-3 group-hover:-translate-y-3 z-0">
                  <program.icon className="size-32 md:size-40 text-primary opacity-[0.06]" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex-1 space-y-2 md:space-y-3">
                  <h3 className="font-display text-lg md:text-2xl font-bold text-text group-hover:text-primary transition-colors leading-tight">
                    {program.title}
                  </h3>
                  <p className="text-text-muted text-sm md:text-base leading-relaxed pr-6 md:pr-10">
                    {program.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
