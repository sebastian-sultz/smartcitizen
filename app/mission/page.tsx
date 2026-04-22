import PageHero from "@/components/layout/PageHero";
import { Target, Eye, Check } from "lucide-react";

export default function MissionPage() {
  return (
    <main className="min-h-screen pt-24">
      <PageHero title="Mission & Vision" />

      <section className="py-24 bg-bg">
        <div className="max-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Panel */}
            <div className="bg-primary text-white p-10 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Target size={120} />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Target size={32} className="text-accent-light" />
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold">Our Mission</h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Our mission is to educate, empower, and uplift society by spreading
                  awareness on essential social, legal, digital, health, environmental,
                  and civic issues in a non-political, non-commercial, and ethical manner.
                </p>
                <div className="space-y-4 pt-4">
                  <h4 className="text-xl font-bold text-accent-light">We Aim To:</h4>
                  <ul className="space-y-4">
                    {[
                      "Create informed and responsible citizens",
                      "Promote safety, dignity, equality, and sustainability",
                      "Support vulnerable sections of society through guidance and assistance",
                      "Encourage lawful behavior, civic responsibility, and community harmony"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={20} className="text-accent-light shrink-0 mt-1" />
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Vision Panel */}
            <div className="bg-accent text-white p-10 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Eye size={120} />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Eye size={32} className="text-white" />
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold">Our Vision</h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  Our vision is to build a safe, aware, inclusive, and empowered society where knowledge becomes the strongest tool for social development.
                </p>
                <div className="space-y-4 pt-4">
                  <h4 className="text-xl font-bold text-white">We Envision a Future Where:</h4>
                  <ul className="space-y-4">
                    {[
                      "Every individual understands their rights and responsibilities",
                      "Children grow up protected, educated, and confident",
                      "Citizens are digitally aware and financially literate",
                      "Communities practice sustainability, equality, and ethical living"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={20} className="text-white shrink-0 mt-1" />
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
