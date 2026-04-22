"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Heart } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background with Parallax effect (simulated via CSS) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: "url('/assets/vision34.jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-dark/60" />
      </div>

      <div className="max-content relative z-10 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent-light text-[13px] font-black uppercase tracking-[0.3em] mb-8">
            Empowering Citizens • Changing Lives
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-[90px] font-black mb-10 leading-[0.95] tracking-tight"
        >
          Building a <span className="text-accent">Smarter</span>,<br />
          Aware & Safer India.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto space-y-6 mb-12"
        >
          <p className="text-lg md:text-2xl text-white/90 font-medium leading-relaxed">
            From climate change awareness to women's empowerment through sports — 
            we are at the grassroots, making a difference every single day.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {['Non-Political', 'Non-Commercial', 'Social Welfare'].map((tag) => (
              <span key={tag} className="px-4 py-1 rounded-lg bg-primary/20 border border-white/10 text-[12px] font-bold uppercase tracking-widest text-white/60">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link 
            href="/donation" 
            className="w-full sm:w-auto bg-accent hover:bg-accent-light text-white px-12 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl shadow-accent/40 text-lg active:scale-95"
          >
            <Heart size={24} fill="currentColor" />
            Support Our Mission
          </Link>
          <Link 
            href="/JoinUs" 
            className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white hover:text-primary text-white px-12 py-5 rounded-2xl font-black transition-all transform hover:-translate-y-1 text-lg active:scale-95"
          >
            Become a Volunteer
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
