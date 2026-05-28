"use client";

import { DonationStats as DonationStatsType } from "../../types";
import { Card, CardContent } from "@/components/ui/Card";
import { Heart, Calendar, CreditCard, Award, Sparkles } from "lucide-react";

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
      color: "from-rose-50 to-rose-100/50 border-rose-100 text-rose-500",
      textColor: "text-rose-900",
      description: "Total direct impact funded"
    },
    {
      title: "This Fiscal Year",
      value: `₹${stats.donatedThisYear.toLocaleString("en-IN")}`,
      icon: Calendar,
      color: "from-blue-50 to-blue-100/50 border-blue-100 text-blue-500",
      textColor: "text-blue-900",
      description: "FY 2026-2027 contributions"
    },
    {
      title: "Total Contributions",
      value: stats.totalTransactions.toString(),
      icon: CreditCard,
      color: "from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-500",
      textColor: "text-emerald-900",
      description: "Successfully processed payments"
    },
    {
      title: "Average Transfer",
      value: `₹${stats.averageAmount.toLocaleString("en-IN")}`,
      icon: Sparkles,
      color: "from-purple-50 to-purple-100/50 border-purple-100 text-purple-500",
      textColor: "text-purple-900",
      description: "Support value per transfer"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Donor Level Badge Alert */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 to-amber-500/0 border border-amber-500/20 rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-2xl text-amber-600">
            <Award size={20} />
          </div>
          <div>
            <p className="font-bold text-sm text-text">
              NGO Patron Level: <span className="text-amber-700 font-extrabold">{stats.donorLevel}</span>
            </p>
            <p className="text-[11px] text-text-muted font-medium mt-0.5">
              Thank you for your continuous support. You receive priority updates on civic assemblies and drives.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className={`bg-gradient-to-br border shadow-sm p-6 flex flex-col justify-between rounded-3xl ${item.color}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider opacity-85 text-text-muted">
                  {item.title}
                </span>
                <Icon size={20} className="shrink-0" />
              </div>
              <div className="mt-4">
                <div className={`text-2xl font-display font-black leading-none ${item.textColor}`}>
                  {item.value}
                </div>
                <p className="text-[11px] opacity-75 font-medium mt-1">
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
