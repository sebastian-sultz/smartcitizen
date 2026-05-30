"use client";

import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { HeartHandshake, MapPin, Users, BookOpen } from "lucide-react";

interface CounterProps {
  end: number;
  suffix?: string;
}

function Counter({ end, suffix = "" }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ImpactCounter() {
  const stats = [
    {
      icon: HeartHandshake,
      value: 50000,
      suffix: "+",
      label: "Lives Impacted",
      desc: "Uplifting and supporting vulnerable citizens with direct guidance and social aids.",
    },
    {
      icon: MapPin,
      value: 12,
      suffix: "+",
      label: "Districts Reached",
      desc: "Expanding awareness and counseling campaigns to key districts across states.",
    },
    {
      icon: Users,
      value: 5000,
      suffix: "+",
      label: "Active Volunteers",
      desc: "Selfless citizens and professionals leading local civic actions and campaigns.",
    },
    {
      icon: BookOpen,
      value: 15,
      suffix: "+",
      label: "Core Programs",
      desc: "Active grassroots initiatives covering cyber-safety, digital rights, health, and law.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-surface border-y border-border relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-content relative z-10">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">
            OUR IMPACT
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text">
            Milestones of Our Mission
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Through collective grassroots action, we are driving measurable social change and building a safer, more aware India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-bg/40 border border-border/60 rounded-3xl p-8 transition-all duration-500 hover:shadow-card hover:border-primary/20 hover:bg-white flex flex-col items-center text-center group cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <stat.icon size={26} strokeWidth={1.75} />
              </div>
              <div className="font-display text-4xl md:text-5xl font-black mb-2 text-text">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <h3 className="font-bold text-text-muted text-[13px] uppercase tracking-widest mb-3">
                {stat.label}
              </h3>
              <p className="text-text-muted/80 text-sm leading-relaxed max-w-[220px]">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
