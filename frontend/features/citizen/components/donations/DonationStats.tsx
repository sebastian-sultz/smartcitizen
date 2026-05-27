"use client";

import { DonationStats as DonationStatsType } from "../../types";
import { Card } from "@/components/ui/Card";
import { Heart, Calendar, CreditCard, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonationStatsProps {
  stats: DonationStatsType | null;
}

export default function DonationStats({ stats }: DonationStatsProps) {
  if (!stats) return null;

  const statCards = [
    {
      title: "Lifetime Contributions",
      value: `₹${stats.lifetimeDonated.toLocaleString("en-IN")}`,
      icon: Heart,
      colorClass: "from-rose-50 to-rose-100/50 border-rose-100 text-rose-600",
      valueClass: "text-rose-900",
      label: `${stats.totalTransactions} donation transactions`,
    },
    {
      title: "Contributions in 2026",
      value: `₹${stats.donatedThisYear.toLocaleString("en-IN")}`,
      icon: Calendar,
      colorClass: "from-primary/5 to-primary/10 border-primary/10 text-primary",
      valueClass: "text-primary-dark",
      label: "Current calendar year",
    },
    {
      title: "Average Contribution",
      value: `₹${Math.round(stats.averageAmount).toLocaleString("en-IN")}`,
      icon: CreditCard,
      colorClass: "from-blue-50 to-blue-100/50 border-blue-100 text-blue-600",
      valueClass: "text-blue-900",
      label: "Per transaction average",
    },
    {
      title: "Donor Class Level",
      value: `${stats.donorLevel} Tier`,
      icon: Award,
      colorClass: "from-purple-50 to-purple-100/50 border-purple-100 text-purple-600",
      valueClass: "text-purple-900 font-bold uppercase tracking-wider text-lg pt-2",
      label: "Thank you for your trust",
      isBadge: true
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
              {card.isBadge ? (
                <div className={cn("text-base font-black py-1", card.valueClass)}>
                  {card.value}
                </div>
              ) : (
                <div className={cn("text-2xl md:text-3xl font-display font-black leading-none", card.valueClass)}>
                  {card.value}
                </div>
              )}
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
