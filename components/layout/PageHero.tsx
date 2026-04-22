"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PageHeroProps {
  title: string;
  image?: string;
}

export default function PageHero({ title, image }: PageHeroProps) {
  return (
    <section className="relative h-[350px] md:h-[500px] flex items-center overflow-hidden bg-primary">
      {/* Background Image Overlay */}
      {image && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>
      )}

      {/* Abstract Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="max-content relative z-10 w-full pt-20">
        <div className="max-w-4xl space-y-8">
          <motion.nav 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-[14px] font-black text-white/60 tracking-[0.2em] uppercase"
          >
            <Link href="/" className="hover:text-white transition-all">Home</Link>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-white">{title}</span>
          </motion.nav>
          
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="font-display text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter"
            >
              {title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 120 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-3 bg-accent rounded-full shadow-2xl shadow-accent/40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
