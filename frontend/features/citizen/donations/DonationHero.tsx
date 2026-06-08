"use client";

import { HeartHandshake, ShieldCheck, Zap, Globe, Coins } from "lucide-react";
import UnifiedDonationForm from "@/features/public/donation/components/UnifiedDonationForm";
import { initiatePayment } from "../api";

interface DonationHeroProps {
  onSuccess: (details: {
    transactionId: string;
    amount: number;
    isManual: boolean;
  }) => void;
}

export default function DonationHero({ onSuccess }: DonationHeroProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-scale-in">
      {/* Left Column: Narrative/Information */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-10 bg-gradient-to-br from-primary to-primary-light text-white rounded-3xl md:rounded-[40px] relative overflow-hidden shadow-card">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl -mb-16 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider">
            <HeartHandshake size={14} className="text-accent-light" />
            Make a Direct Impact
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-black leading-[1.1] tracking-tight">
            Support the Future of <br className="hidden md:inline" />{" "}
            SmartCitizen Initiatives
          </h1>

          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl">
            Your contributions directly fund localized civic activities. We
            allocate resources to empower neighborhood assemblies, support eco
            clean-up operations, and deploy community tools that encourage
            citizen involvement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-3xl border border-white/10">
              <ShieldCheck
                size={20}
                className="text-accent-light shrink-0 mt-0.5"
              />
              <div>
                <p className="font-bold text-sm text-white">
                  80G Tax Deductible
                </p>
                <p className="text-xs text-white/70">
                  Claim rebates on your contributions automatically
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-4 rounded-3xl border border-white/10">
              <Zap size={20} className="text-accent-light shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-white">
                  Direct Deployment
                </p>
                <p className="text-xs text-white/70">
                  Funds routed straight to local civic programs
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-8 mt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <Globe size={14} />
            <span>smartcitizen.org/transparency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins size={14} />
            <span>Audited & verified finances</span>
          </div>
        </div>
      </div>

      {/* Right Column: Reusable Unified Donation Form */}
      <div className="lg:col-span-5 flex">
        <UnifiedDonationForm
          submitApiCall={initiatePayment}
          onSuccess={onSuccess}
          title="Quick Contribution"
          description="Support citizen activities directly"
        />
      </div>
    </div>
  );
}
