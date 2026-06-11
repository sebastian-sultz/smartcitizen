"use client";

import { HeartHandshake, ShieldCheck, Zap, Globe, Coins } from "lucide-react";

export default function DonationHero() {
  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-r from-primary via-indigo-950 to-primary p-8 md:p-12 rounded-[32px] text-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] flex flex-col justify-between min-h-[300px]">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent-light/10 rounded-full blur-2xl -mb-24 pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider">
          <HeartHandshake size={14} className="text-accent-light" />
          Direct Local Impact
        </div>

    
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-[1.1] tracking-tight">
            Support the Future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light via-accent to-accent-light">
              SmartCitizen
            </span>{" "}
            Initiatives
          </h1>
     
      </div>

      {/* Trust Checklist & Transparency Grid */}
      <div className="relative z-10 mt-8 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 text-accent-light">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm text-white">
              80G Tax Deductible
            </p>
            <p className="text-[10px] sm:text-xs text-white/70 mt-0.5">
              Claim rebates automatically on your contributions
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 text-accent-light">
            <Zap size={18} />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm text-white">
              Direct Deployment
            </p>
            <p className="text-[10px] sm:text-xs text-white/70 mt-0.5">
              Funds routed straight to local civic programs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-white/60 font-semibold lg:justify-center">
          <Globe size={16} className="text-white/45 shrink-0" />
          <span>smartcitizen.org/transparency</span>
        </div>

        <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-white/60 font-semibold lg:justify-end">
          <Coins size={16} className="text-white/45 shrink-0" />
          <span>Audited & verified finances</span>
        </div>
      </div>
    </div>
  );
}
