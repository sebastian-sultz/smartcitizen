"use client";

import { DashboardStats } from "../types";
import { Card } from "@/components/ui/Card";
import { Heart, Users, Network, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface StatsGridProps {
  stats: DashboardStats | null;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) return null;

  const statCards = [
    {
      title: "Direct Referrals",
      value: stats.total_referrals.toString(),
      icon: Users,
      colorClass: "from-blue-50 to-blue-100/50 border-blue-100 text-blue-600",
      valueClass: "text-blue-900",
      label: "Citizens registered via you",
      href: "/citizen/referrals",
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Overall Network",
      value: stats.overall_referrals.toString(),
      icon: Network,
      colorClass:
        "from-purple-50 to-purple-100/50 border-purple-100 text-purple-600",
      valueClass: "text-purple-900",
      label: "Extended community network",
      href: "/citizen/referrals",
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "My Donations",
      value: `₹${stats.total_amount.toLocaleString("en-IN")}`,
      icon: Heart,
      colorClass: "from-rose-50 to-rose-100/50 border-rose-100 text-rose-600",
      valueClass: "text-rose-900",
      label: "Direct contributions",
      href: "/citizen/donations",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "Network Donations",
      value: `₹${stats.overall_network_donation.toLocaleString("en-IN")}`,
      icon: Award,
      colorClass:
        "from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-600",
      valueClass: "text-emerald-900",
      label: "Impact from referred community",
      href: "/citizen/referrals",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <>
      {/* Mobile view: Unified Row List Card */}
      <div className="block sm:hidden">
        <Card shape="lg" className="p-4 divide-y divide-border/60">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                href={card.href}
                key={idx}
                className="flex items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1 group  active:bg-bg/50 transition-colors w-full"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl border flex items-center justify-center shrink-0",
                      card.iconBg,
                    )}
                  >
                    <Icon size={14} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider block truncate">
                      {card.title}
                    </span>
                    <span className="text-[10px] text-text-muted/80 block truncate leading-tight">
                      {card.label}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={cn(
                      "text-base font-display font-black leading-none",
                      card.valueClass,
                    )}
                  >
                    {card.value}
                  </span>
                </div>
              </Link>
            );
          })}
        </Card>
      </div>

      {/* Desktop view: Grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link href={card.href} key={idx} className="block group ">
              <Card
                className={cn(
                  "h-full bg-gradient-to-br border shadow-sm group-hover:shadow-md group-hover:scale-[1.01] transition-all duration-300 p-5 flex flex-col justify-between rounded-[28px] cursor-pointer min-h-[145px]",
                  card.colorClass,
                )}
              >
                <div>
                  {/* Top Header Row with inline Icon-Badge */}
                  <div className="flex items-center gap-2.5 mb-3.5">
                    <div
                      className={cn(
                        "w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-sm",
                        card.iconBg,
                      )}
                    >
                      <Icon size={13} className="stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-text-muted truncate">
                      {card.title}
                    </span>
                  </div>

                  {/* Large Metric Value */}
                  <div
                    className={cn(
                      "text-2xl md:text-3xl font-display font-black leading-none tracking-tight",
                      card.valueClass,
                    )}
                  >
                    {card.value}
                  </div>
                </div>

                {/* Subtitle description label at the bottom */}
                <p className="text-[11px] font-medium opacity-80 mt-3 leading-relaxed">
                  {card.label}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
