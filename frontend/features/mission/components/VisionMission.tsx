import { Target, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionVisionCardProps {
  type: 'mission' | 'vision';
  title: string;
  description: string;
  items: string[];
  pointsHeader: string;
}

export const MissionVisionCard = ({ type, title, description, items, pointsHeader }: MissionVisionCardProps) => {
  const isMission = type === 'mission';
  const Icon = isMission ? Target : Eye;
  
  return (
    <div className={cn(
      "p-10 md:p-16 rounded-[40px] shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-primary/10",
      isMission ? "bg-primary text-white" : "bg-accent text-white"
    )}>
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <Icon size={120} />
      </div>
      <div className="relative z-10 space-y-8">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
          <Icon size={32} className={cn(isMission ? "text-accent-light" : "text-white")} />
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">{title}</h2>
        <p className="text-white/80 text-lg leading-relaxed">{description}</p>
        
        <div className="space-y-4 pt-4">
          <h4 className={cn("text-xl font-bold", isMission ? "text-accent-light" : "text-white")}>
            {pointsHeader}
          </h4>
          <ul className="space-y-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check size={20} className={cn("shrink-0 mt-1", isMission ? "text-accent-light" : "text-white")} />
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const MissionVision = () => {
  return (
    <section className="py-24 bg-bg">
      <div className="max-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MissionVisionCard 
            type="mission"
            title="Our Mission"
            description="Our mission is to educate, empower, and uplift society by spreading awareness on essential social, legal, digital, health, environmental, and civic issues."
            pointsHeader="We Aim To:"
            items={[
              "Create informed and responsible citizens",
              "Promote safety, dignity, equality, and sustainability",
              "Support vulnerable sections of society through guidance",
              "Encourage lawful behavior and community harmony"
            ]}
          />
          <MissionVisionCard 
            type="vision"
            title="Our Vision"
            description="Our vision is to build a safe, aware, inclusive, and empowered society where knowledge becomes the strongest tool for social development."
            pointsHeader="We Envision a Future Where:"
            items={[
              "Every individual understands their rights and responsibilities",
              "Children grow up protected, educated, and confident",
              "Citizens are digitally aware and financially literate",
              "Communities practice sustainability and ethical living"
            ]}
          />
        </div>
      </div>
    </section>
  );
};
