"use client";

import { UserResponse } from "@/features/shared/auth/types";
import { Card } from "@/components/ui/Card";
import { Users, ShieldCheck, Heart } from "lucide-react";

interface ReferralStatsProps {
  user: UserResponse | null;
}

export default function ReferralStats({ user }: ReferralStatsProps) {
  if (!user) return null;

  const cards = [
    {
      title: "Successfully Joined",
      value: user.total_referrals,
      icon: Users,
      color: "from-purple-50 to-purple-100/50 border-purple-100 text-purple-500",
      textColor: "text-purple-900",
      description: "Verified account sign ups"
    },
    {
      title: "Referred Payments",
      value: user.referral_payment_count,
      icon: ShieldCheck,
      color: "from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-500",
      textColor: "text-emerald-950",
      description: "Direct impact contributors"
    },
    
  ];

  return (
    <>
      {/* Mobile view: Unified Row List Card */}
      <div className="block sm:hidden">
        <Card shape="lg" className="p-4 divide-y divide-border/60">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="flex items-center justify-between gap-3 py-3.5 first:pt-1.5 last:pb-1.5 min-w-0">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider block">
                    {card.title}
                  </span>
                  <p className="text-[10.5px] text-text-muted/90 font-medium truncate">
                    {card.description}
                  </p>
                </div>
                <div className="shrink-0 text-right flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-black text-text block">
                      {typeof card.value === "number" ? card.value.toLocaleString("en-IN") : card.value}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
                    <Icon size={14} className="stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Desktop view: Stats Cards Grid */}
      <div className="hidden sm:grid grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className={`bg-gradient-to-br border shadow-sm p-6 flex flex-col justify-between rounded-3xl ${card.color}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider opacity-85 text-text-muted">
                  {card.title}
                </span>
                <Icon size={20} className="shrink-0" />
              </div>
              <div className="mt-4">
                <div className={`text-2xl font-display font-black leading-none ${card.textColor}`}>
                  {typeof card.value === "number" ? card.value.toLocaleString("en-IN") : card.value}
                </div>
                <p className="text-[11px] opacity-75 font-medium mt-1">
                  {card.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
