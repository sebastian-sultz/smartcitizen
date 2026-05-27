"use client";

import { ReferralStats as ReferralStatsType } from "../../types";
import { Card } from "@/components/ui/Card";
import { Users, UserPlus, Gift, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferralStatsProps {
  stats: ReferralStatsType | null;
}

export default function ReferralStats({ stats }: ReferralStatsProps) {
  if (!stats) return null;

  const statCards = [
    {
      title: "Total Invited",
      value: stats.totalInvited.toString(),
      icon: Users,
      colorClass: "from-blue-50 to-blue-100/50 border-blue-100 text-blue-600",
      valueClass: "text-blue-900",
      label: "Links sent or clicked",
    },
    {
      title: "Registered Members",
      value: stats.joinedCount.toString(),
      icon: UserPlus,
      colorClass: "from-primary/5 to-primary/10 border-primary/10 text-primary",
      valueClass: "text-primary-dark",
      label: "Completed signup forms",
    },
    {
      title: "Active Donors",
      value: stats.activeDonorsCount.toString(),
      icon: Gift,
      colorClass: "from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-600",
      valueClass: "text-emerald-900",
      label: "Referred members who donated",
    },
    {
      title: "Impact Generated",
      value: `₹${stats.totalContributionGenerated.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      colorClass: "from-rose-50 to-rose-100/50 border-rose-100 text-rose-600",
      valueClass: "text-rose-900",
      label: "Total donation from your network",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card 
            key={idx} 
            className={cn(
              "bg-gradient-to-br border shadow-sm p-6 flex flex-col justify-between rounded-3xl",
              card.colorClass
            )}
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 text-text-muted">
                {card.title}
              </span>
              <Icon size={20} className="opacity-90 shrink-0" />
            </div>
            
            <div className="mt-4">
              <div className={cn("text-2xl md:text-3xl font-display font-black leading-none", card.valueClass)}>
                {card.value}
              </div>
              <p className="text-[10px] opacity-75 font-semibold mt-1.5 uppercase tracking-wider">
                {card.label}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
