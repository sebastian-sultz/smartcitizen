"use client";

import { ReferralStats as ReferralStatsType } from "../../types";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, UserCheck, ShieldCheck, Heart } from "lucide-react";

interface ReferralStatsProps {
  stats: ReferralStatsType | null;
}

export default function ReferralStats({ stats }: ReferralStatsProps) {
  if (!stats) return null;

  const cards = [
    {
      title: "Invitations Sent",
      value: stats.totalInvited,
      icon: Users,
      color: "from-blue-50 to-blue-100/50 border-blue-100 text-blue-500",
      textColor: "text-blue-900",
      description: "Invitations dispatch tracking"
    },
    {
      title: "Successfully Joined",
      value: stats.joinedCount,
      icon: UserCheck,
      color: "from-purple-50 to-purple-100/50 border-purple-100 text-purple-500",
      textColor: "text-purple-900",
      description: "Verified account sign ups"
    },
    {
      title: "Active Donors",
      value: stats.activeDonorsCount,
      icon: ShieldCheck,
      color: "from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-500",
      textColor: "text-emerald-950",
      description: "Direct impact contributors"
    },
    {
      title: "Impact Contribution",
      value: `₹${stats.totalContributionGenerated.toLocaleString("en-IN")}`,
      icon: Heart,
      color: "from-rose-50 to-rose-100/50 border-rose-100 text-rose-500",
      textColor: "text-rose-900",
      description: "NGO funding raised via you"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
