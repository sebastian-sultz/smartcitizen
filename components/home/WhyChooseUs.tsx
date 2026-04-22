import { Check } from "lucide-react";

const reasons = [
  {
    title: "Holistic Approach",
    desc: "We work across multiple social dimensions: environment, health, law, education, digital safety, and ethics."
  },
  {
    title: "Grassroots Impact",
    desc: "Our programs directly reach citizens, students, women, children, and senior citizens."
  },
  {
    title: "Neutral & Ethical",
    desc: "All initiatives are strictly non-political, non-commercial, and awareness-focused."
  },
  {
    title: "Expert-Guided Programs",
    desc: "Sessions are designed with practical, real-life relevance."
  },
  {
    title: "Community-Centered",
    desc: "We believe in participation, inclusion, and long-term impact rather than one-time events."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-bg-alt">
      <div className="max-content">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left - Image */}
          <div className="flex-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl h-full min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1949&auto=format&fit=crop" 
                alt="Community Group" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">WHY CHOOSE US</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Our Promise to Every Community</h2>
            </div>

            <div className="space-y-8">
              {reasons.map((reason, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-body font-bold text-lg text-text mb-1">{reason.title}</h4>
                    <p className="text-text-muted text-[15px] leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
