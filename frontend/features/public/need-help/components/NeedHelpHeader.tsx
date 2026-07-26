"use client";

import { ShieldAlert } from "lucide-react";

export const NeedHelpHeader = () => {
  return (
    <div className="space-y-8 mb-12">
      {/* Official Registry Directory Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b border-border">
        <h2 className="font-display text-3xl sm:text-4xl font-black text-text tracking-tight">
          Public Directory of Verified Support
        </h2>

        {/* Status Widget */}
        <div className="flex items-center gap-3 bg-white border border-border px-4 py-3 rounded-2xl shrink-0 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
          </span>
          <div>
            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider leading-none">
              Registry Status
            </div>
            <div className="text-[13px] font-bold text-success mt-1 leading-none">
              Live & Verified
            </div>
          </div>
        </div>
      </div>

      {/* Official Advisory Notice */}
      <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl p-5 flex gap-4 items-start shadow-sm">
        <div className="bg-primary/10 text-primary p-2 rounded-xl shrink-0 mt-0.5">
          <ShieldAlert size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[14px] font-bold text-primary uppercase tracking-wider">
            Citizen Advisory & Guidance Terms
          </h4>
          <p className="text-[14px] text-text-muted leading-relaxed">
            All listed professionals are verified members of the Smart Citizen
            civic initiative. Consultations, preliminary legal guidance, and
            general health support offered through this registry are free of
            charge. For formal engagement beyond basic assistance, standardized
            citizen rates may apply.
          </p>
        </div>
      </div>
    </div>
  );
};
