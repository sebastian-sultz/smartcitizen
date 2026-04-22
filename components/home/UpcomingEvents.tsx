import Link from "next/link";
import { MoveRight } from "lucide-react";

const events = [
  {
    title: "Awareness & Guidance Program",
    date: "05 JUL 2026",
    category: "Community",
    desc: "A special program to provide legal and social guidance to community members, empowering them with knowledge.",
    img: "/assets/a2.png"
  },
  {
    title: "Eco-Friendly Awareness",
    date: "12 JUL 2026",
    category: "Environment",
    desc: "GlobalSmart promotes eco-friendly practices, tree plantation, waste reduction, and environmental awareness.",
    img: "/assets/a1.png"
  },
  {
    title: "Grassroots Cricket Promotion",
    date: "30 JUL 2026",
    category: "Sports",
    desc: "GlobalSmart Citizens Foundation conducts tournaments to inspire youth participation, develop skills, and strengthen community sports culture.",
    img: "/assets/a23.jpeg"
  }
];

export default function UpcomingEvents() {
  return (
    <section className="py-16 md:py-24 bg-bg">
      <div className="max-content">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">UPCOMING EVENTS</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">Be Part of What&apos;s Coming</h2>
          </div>
          <Link 
            href="/events" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all whitespace-nowrap"
          >
            View All Events
            <MoveRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={event.img} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider shadow-lg">
                  {event.date}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <span className="text-accent text-[11px] font-bold uppercase tracking-widest mb-2">{event.category}</span>
                <h3 className="font-display text-xl font-bold mb-4 text-text group-hover:text-primary transition-colors">{event.title}</h3>
                <p className="text-text-muted text-[15px] leading-relaxed mb-6 flex-1">
                  {event.desc}
                </p>
                <Link 
                  href="/events" 
                  className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-light transition-colors group/link"
                >
                  Learn More 
                  <MoveRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
