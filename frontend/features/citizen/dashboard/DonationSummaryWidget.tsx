"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { DonationStats } from "../types";
import { Heart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface DonationSummaryWidgetProps {
  stats: DonationStats | null;
}

export default function DonationSummaryWidget({ stats }: DonationSummaryWidgetProps) {
  const router = useRouter();

  if (!stats) return null;

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base font-bold text-text flex items-center gap-2">
          <Heart size={18} className="text-accent" fill="currentColor" />
          Donation Ledger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {/* Lifetime Donated Summary Card */}
          <div className="flex justify-between items-center p-3 bg-accent/5 border border-accent/10 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <Heart size={14} fill="currentColor" />
              </div>
              <div>
                <p className="text-[11px] text-text-muted font-medium">Lifetime Donated</p>
                <p className="text-base font-display font-black text-text">
                  ₹{stats.lifetimeDonated.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-accent/15 text-accent rounded-full">
                {stats.donorLevel}
              </span>
            </div>
          </div>

          {/* Fiscal Year & Average Donation Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-bg/50 border border-border/50 rounded-2xl">
              <p className="text-[10px] text-text-muted font-medium">This Fiscal Year</p>
              <p className="text-sm font-display font-bold text-text mt-0.5">
                ₹{stats.donatedThisYear.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 bg-bg/50 border border-border/50 rounded-2xl">
              <p className="text-[10px] text-text-muted font-medium">Avg. Donation</p>
              <p className="text-sm font-display font-bold text-text mt-0.5">
                ₹{stats.averageAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* View History CTA */}
        <Button 
          onClick={() => router.push("/citizen/donations")}
          variant="outline" 
          className="w-full text-xs font-bold py-2.5 h-auto rounded-xl gap-2 border-primary/20 hover:bg-primary/5 text-primary"
        >
          View Donation History
          <ArrowUpRight size={14} />
        </Button>
      </CardContent>
    </Card>
  );
}
