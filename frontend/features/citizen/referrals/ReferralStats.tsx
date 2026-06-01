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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
  );
}
