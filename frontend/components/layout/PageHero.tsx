"use client";

import { motion } from "framer-motion";
import { ChevronRight, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  image?: string;
}

export default function PageHero({ title, image }: PageHeroProps) {
  return (
    <section className="relative h-[300px] md:h-[380px] flex items-center overflow-hidden bg-primary border-b border-border">
      {/* Background Image Overlay */}
      {image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-20 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/40" />
        </div>
      )}

      {/* Structured Grid Pattern for official aesthetic */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" className="text-white">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Official Civic Watermark Seal */}
      <div className="absolute right-0 bottom-0 translate-y-1/6 translate-x-1/8 pointer-events-none text-white/5 z-0 hidden lg:block">
        <Landmark size={480} strokeWidth={0.5} />
      </div>

      <div className="max-content relative z-10 w-full pt-12 md:pt-16">
        <div className="max-w-4xl space-y-6">
          {/* Trust Banner Tag */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-white bg-white/10 border border-white/20 px-3 py-1 rounded-full w-fit tracking-[0.15em] uppercase backdrop-blur-sm"
          >
            <Landmark size={12} className="text-accent" />
            <span>Official Civic Portal</span>
            <span className="w-1 h-1 rounded-full bg-accent/80" />
            <span className="text-white/70 font-semibold">Smart Citizen Registry</span>
          </motion.div>

          <div className="space-y-3">
            {/* Page Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight"
            >
              {title}
            </motion.h1>

            {/* Sharp Accent Line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[3px] bg-accent origin-left w-24 rounded-full"
            />
          </div>

          {/* breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 text-[12px] font-bold text-white/60 tracking-[0.08em] uppercase"
          >
            <Link href="/" className="hover:text-white transition-all">
              Home
            </Link>
            <ChevronRight size={13} className="text-accent shrink-0" />
            <span className="text-white font-semibold">{title}</span>
          </motion.nav>
        </div>
      </div>

      {/* Tricolor Official Stripe Accent along bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 flex z-10">
        <div className="flex-grow bg-primary-light" />
        <div className="w-[150px] bg-white opacity-90" />
        <div className="w-[100px] bg-accent" />
      </div>
    </section>
  );
}

