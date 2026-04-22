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
          backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')",
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-[13px] font-bold uppercase tracking-[0.2em] mb-6">
            EMPOWERING COMMUNITIES ACROSS INDIA
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl lg:text-[80px] font-black mb-8 leading-[1.1]"
        >
          Building a Smarter,<br />
          <span className="text-accent">Safer, More Aware</span> Society.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-white/80 font-light mb-10 leading-relaxed"
        >
          GlobalSmart Citizens Foundation is a registered non-profit empowering
          citizens through awareness, education, and grassroots action — across
          environment, health, law, digital safety, and more.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/donation" 
            className="w-full sm:w-auto bg-accent hover:bg-accent-light text-white px-10 py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-xl shadow-accent/20"
          >
            <Heart size={20} fill="currentColor" />
            Support the Cause
          </Link>
          <Link 
            href="/JoinUs" 
            className="w-full sm:w-auto bg-transparent border-2 border-white hover:bg-white hover:text-dark text-white px-10 py-4 rounded-lg font-bold transition-all transform hover:-translate-y-1"
          >
            Join as a Volunteer
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
