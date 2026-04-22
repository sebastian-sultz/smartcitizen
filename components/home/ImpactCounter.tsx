"use client";

import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface CounterProps {
  end: number;
  label: string;
  suffix?: string;
}

function Counter({ end, label, suffix = "" }: CounterProps) {
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
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-black mb-1">
        {count}{suffix}
      </div>
      <div className="text-[12px] uppercase tracking-widest font-bold opacity-60">
        {label}
      </div>
    </div>
  );
}

export default function ImpactCounter() {
  return (
    <div className="bg-primary text-white py-12 md:py-16">
      <div className="max-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          <Counter end={15} label="Programs" suffix="+" />
          <div className="hidden md:block w-px h-12 bg-white/20 mx-auto" />
          <Counter end={6} label="Focus Areas" />
          <div className="hidden md:block w-px h-12 bg-white/20 mx-auto" />
          <Counter end={500} label="Volunteers" suffix="+" />
          <div className="hidden md:block w-px h-12 bg-white/20 mx-auto" />
          <Counter end={10000} label="Citizens Reached" suffix="+" />
        </div>
      </div>
    </div>
  );
}
