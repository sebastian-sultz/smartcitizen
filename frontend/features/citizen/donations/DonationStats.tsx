"use client";

import { DonationStats as DonationStatsType } from "../types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getDonorLevel } from "../utils";
import { cn } from "@/lib/utils";

interface DonationStatsProps {
  stats: DonationStatsType | null;
}

export default function DonationStats({ stats }: DonationStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, idx) => (
          <Card shape="xl"
            key={idx}
            className="p-6 flex flex-col justify-between min-h-[130px] h-auto"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-36" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const formatRupeesParts = (val: number) => {
    const rounded = val.toFixed(2);
    const [whole, decimal] = rounded.split(".");
    const formattedWhole = Number(whole).toLocaleString("en-IN");
    return { whole: formattedWhole, decimal };
  };

  const totalParts = formatRupeesParts(stats.lifetimeDonated);
  const avgParts = formatRupeesParts(stats.averageAmount);
  const thisYearParts = formatRupeesParts(stats.donatedThisYear);
  const lastMonthParts = formatRupeesParts(stats.donatedLastMonth);

  const level = getDonorLevel(stats.lifetimeDonated);
  const getLevelBadgeVariant = (lvl: string) => {
    switch (lvl) {
      case "Platinum": return "info";
      case "Gold": return "warning";
      case "Silver": return "secondary";
      default: return "muted";
    }
  };

  const statsItems = [
    {
      title: "Total Donated",
      whole: `₹${totalParts.whole}`,
      decimal: `.${totalParts.decimal}`,
      badge: (
        <Badge variant={getLevelBadgeVariant(level)} size="sm">
          {level}
        </Badge>
      ),
      subtitle: `Avg. Contribution: ₹${avgParts.whole}.${avgParts.decimal}`,
      bgGradient: "from-rose-50 to-rose-100/40 border-rose-100",
      valueClass: "text-rose-900",
      titleClass: "text-rose-800/80",
      subtitleClass: "text-rose-700/95",
    },
    {
      title: "Donated This Year",
      whole: `₹${thisYearParts.whole}`,
      decimal: `.${thisYearParts.decimal}`,
      badge: (
        <Badge variant="success" size="sm">
          Yearly
        </Badge>
      ),
      subtitle: "This fiscal year",
      bgGradient: "from-green-50 to-emerald-100/40 border-green-100",
      valueClass: "text-green-900",
      titleClass: "text-green-800/80",
      subtitleClass: "text-green-700/95",
    },
    {
      title: "Donated Last Month",
      whole: `₹${lastMonthParts.whole}`,
      decimal: `.${lastMonthParts.decimal}`,
      badge: (
        <Badge variant="info" size="sm">
          Monthly
        </Badge>
      ),
      subtitle: "Last calendar month",
      bgGradient: "from-sky-50 to-blue-100/40 border-sky-100",
      valueClass: "text-blue-900",
      titleClass: "text-blue-800/80",
      subtitleClass: "text-blue-700/95",
    },
    {
      title: "Total Donations",
      whole: stats.totalTransactions.toLocaleString("en-IN"),
      decimal: "",
      badge: (
        <Badge variant="neutral" size="sm">
          Transactions
        </Badge>
      ),
      subtitle: "Successful contributions",
      bgGradient: "from-violet-50 to-purple-100/40 border-violet-100",
      valueClass: "text-purple-900",
      titleClass: "text-purple-800/80",
      subtitleClass: "text-purple-700/95",
    },
  ];

  return (
    <>
      {/* Mobile view: Unified Row List Card */}
      <div className="block sm:hidden">
        <Card shape="lg" className="p-4 divide-y divide-border/60">
          {statsItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 py-3.5 first:pt-1.5 last:pb-1.5 min-w-0">
              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider block">
                  {item.title}
                </span>
                <p className="text-[10.5px] text-text-muted/90 font-medium truncate" title={item.subtitle}>
                  {item.subtitle}
                </p>
              </div>
              <div className="shrink-0 text-right space-y-1">
                <div className="flex items-baseline justify-end font-display">
                  <span className="text-sm font-black text-text">
                    {item.whole}
                  </span>
                  {item.decimal && (
                    <span className="text-[10px] font-bold text-text-muted ml-0.5">
                      {item.decimal}
                    </span>
                  )}
                </div>
                <div className="flex justify-end">
                  {item.badge}
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Desktop view: Stats Grid */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statsItems.map((item, idx) => (
          <Card shape="xl"
            key={idx}
            className={cn(
              "p-6 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br min-h-[130px] h-auto",
              item.bgGradient
            )}
          >
            <div className="space-y-1">
              <span className={cn("text-xs font-bold uppercase tracking-wider opacity-85", item.titleClass)}>
                {item.title}
              </span>
              <div className="flex items-baseline font-display">
                <span className={cn("text-3xl md:text-4xl font-black tracking-tight", item.valueClass)}>
                  {item.whole}
                </span>
                {item.decimal && (
                  <span className={cn("text-xl md:text-2xl font-bold opacity-75 ml-0.5", item.valueClass)}>
                    {item.decimal}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex flex-col items-start gap-1.5">
              {item.badge}
              <span className={cn("text-[11px] font-semibold leading-none", item.subtitleClass)}>
                {item.subtitle}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

