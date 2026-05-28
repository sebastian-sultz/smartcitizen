import PageHero from "@/components/layout/PageHero";
import { BookOpen, Briefcase, UserCheck, Heart, Scale, Users } from "lucide-react";
import { ContactForm, ContactInfo } from "@/features/contact";

const helpAreas = [
  { icon: BookOpen, title: "Education & Career Guidance", desc: "Helping students and job seekers make the right choices." },
  { icon: Briefcase, title: "Employment & Skill Development", desc: "Connecting you with training and job opportunities." },
  { icon: UserCheck, title: "Women Empowerment & Safety", desc: "Supporting women to build confidence and safety." },
  { icon: Heart, title: "Health & Wellness Support", desc: "Guidance on healthcare and mental well-being." },
  { icon: Scale, title: "Legal Awareness & Basic Guidance", desc: "Helping you understand your legal rights." },
  { icon: Users, title: "Social Welfare & Community", desc: "Standing with communities for a better society." },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <PageHero title="Get Help & Support" image="/assets/vision34.jpeg" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-content">
          {/* Empathy Statement */}
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text leading-tight">
              We Are Here to Listen, Support, and Guide You.
            </h2>
            <div className="space-y-6 text-text-muted text-[18px] leading-relaxed">
              <p>
                At GlobalSmart Citizens Foundation, we understand that every individual
                may face challenges at different stages of life.
              </p>
              <p className="font-display text-2xl font-bold text-primary italic">
                &quot;You are not alone. Reach out to us — We are here to help.&quot;
              </p>
            </div>
          </div>

          {/* Help Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {helpAreas.map((area, i) => (
              <div key={i} className="bg-bg p-8 rounded-3xl border border-border hover:border-primary/20 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <area.icon size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-text mb-2">{area.title}</h3>
                <p className="text-text-muted text-[15px]">{area.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            <ContactForm helpAreas={helpAreas.map(area => ({ title: area.title }))} />
            <ContactInfo />
          </div>
        </div>
      </section>
    </main>
  );
}
