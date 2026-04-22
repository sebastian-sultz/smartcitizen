"use client";

import { motion } from "framer-motion";

const partners = [
  "Ministry of Environment", "Digital India Initiative", "NITI Aayog (NGO Darpan)",
  "HDFC Bank", "Community Health Center", "National Sports Council",
  "Legal Aid Society", "Global Citizen Network", "Eco Warriors India"
];

export default function PartnerMarquee() {
  return (
    <div className="py-12 bg-white border-y border-border overflow-hidden">
      <div className="max-content mb-8 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-text-light">TRUSTED BY & PARTNERED WITH</span>
      </div>
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          className="flex whitespace-nowrap gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...partners, ...partners].map((partner, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <div className="w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform" />
              <span className="text-2xl md:text-3xl font-display font-black text-text/20 group-hover:text-primary transition-colors">
                {partner}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
