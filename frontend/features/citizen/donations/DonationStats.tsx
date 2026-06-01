"use client";

import { DonationStats as DonationStatsType } from "../types";
import { Card } from "@/components/ui/Card";
import { Heart, Calendar, CreditCard } from "lucide-react";

interface DonationStatsProps {
  stats: DonationStatsType | null;
}

export default function DonationStats({ stats }: DonationStatsProps) {
  if (!stats) return null;

  const statsItems = [
    {
      title: "Lifetime Support",
      value: `₹${stats.lifetimeDonated.toLocaleString("en-IN")}`,
      icon: Heart,
      color: "from-accent/5 to-accent/15 border-accent/20 text-accent",
      textColor: "text-text",
      description: "Total direct impact funded",
    },
    {
      title: "This Fiscal Year",
      value: `₹${stats.donatedThisYear.toLocaleString("en-IN")}`,
      icon: Calendar,
      color: "from-primary/5 to-primary/15 border-primary/20 text-primary",
      textColor: "text-primary",
      description: "FY 2026-2027 contributions",
    },
    {
      title: "Total Contributions",
      value: stats.totalTransactions.toString(),
      icon: CreditCard,
      color: "from-success-bg to-success-bg/80 border-success/20 text-success",
      textColor: "text-success",
      description: "Successfully processed payments",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              className={`bg-gradient-to-br border shadow-sm p-6 flex flex-col justify-between rounded-3xl ${item.color} animate-fade-in-up hover:scale-[1.02] transition-transform duration-300`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider opacity-85 text-text-muted">
                  {item.title}
                </span>
                <Icon size={20} className="shrink-0" />
              </div>
              <div className="mt-4">
                <div
                  className={`text-2xl md:text-3xl font-display font-black leading-none ${item.textColor}`}
                >
                  {item.value}
                </div>
                <p className="text-[11px] opacity-75 font-medium mt-1 text-text-muted">
                  {item.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
