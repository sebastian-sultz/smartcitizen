import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PageHeroProps {
  title: string;
  breadcrumb?: { name: string; href: string }[];
}

export default function PageHero({ title }: PageHeroProps) {
  return (
    <section className="relative h-[240px] md:h-[300px] flex items-center bg-primary overflow-hidden pt-20">
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      <div className="max-content relative z-10 w-full">
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-[13px] text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">{title}</span>
          </nav>
          
          <h1 className="font-display text-4xl md:text-6xl font-black text-white">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
