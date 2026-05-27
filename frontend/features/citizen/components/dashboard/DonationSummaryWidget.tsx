"use client";

import { DonationStats, DonationRecord } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Heart, Calendar, CreditCard, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface DonationSummaryWidgetProps {
  stats: DonationStats | null;
  recentDonations: DonationRecord[];
}

export default function DonationSummaryWidget({ stats, recentDonations }: DonationSummaryWidgetProps) {
  const router = useRouter();

  if (!stats) return null;

  const lastDonation = recentDonations.find(d => d.status === 'success');
  const lastDonationDate = lastDonation
    ? new Date(lastDonation.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No successful donations yet";

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
            <Heart className="text-primary" size={18} />
            My Contributions
          </CardTitle>
          <Button 
            variant="link"
            size="sm"
            onClick={() => router.push("/citizen/donations")}
            className="inline-flex items-center gap-0.5 text-[12px] font-bold text-primary hover:text-primary/80 p-0 h-auto border-none shadow-none"
            aria-label="Navigate to donations page"
          >
            History
            <ArrowRight size={12} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Simple details */}
        <div className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[11px] text-primary font-bold uppercase tracking-wider">
              Contribution This Year
            </p>
            <p className="text-3xl font-display font-black text-primary mt-1">
              ₹{stats.donatedThisYear.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-text-muted mt-1 font-semibold">
              Lifetime contribution: ₹{stats.lifetimeDonated.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-2 font-medium">
                <Calendar size={14} className="text-primary/70" />
                <span>Last Donation</span>
              </span>
              <span className="font-bold text-text">
                {lastDonation ? `₹${lastDonation.amount.toLocaleString("en-IN")}` : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-2 font-medium">
                <ClockIcon size={14} className="text-primary/70" />
                <span>Date</span>
              </span>
              <span className="font-bold text-text">{lastDonationDate}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-2 font-medium">
                <CreditCard size={14} className="text-primary/70" />
                <span>Donor Class</span>
              </span>
              <span className="font-bold text-primary uppercase tracking-wide text-[10px] px-2 py-0.5 bg-primary/5 rounded-full">
                {stats.donorLevel} Tier
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push("/citizen/donations")}
          fullWidth
          className="bg-accent hover:bg-accent/90 text-white font-bold gap-2 py-3 rounded-2xl h-auto"
        >
          View Donation History
        </Button>
      </CardContent>
    </Card>
  );
}

// Compact internal clock icon to save lines
function ClockIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
