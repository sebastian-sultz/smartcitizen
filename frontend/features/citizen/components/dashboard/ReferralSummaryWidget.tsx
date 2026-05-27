"use client";

import { ReferralStats } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Share2, Users, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReferralSummaryWidgetProps {
  stats: ReferralStats | null;
  onInviteClick?: () => void;
}

export default function ReferralSummaryWidget({ stats, onInviteClick }: ReferralSummaryWidgetProps) {
  const router = useRouter();

  if (!stats) return null;

  // Let's compute progress toward the Volunteer Application threshold (10 joined members)
  const targetJoined = 10;
  const progressPercent = Math.min(Math.round((stats.joinedCount / targetJoined) * 100), 100);

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
            <Share2 className="text-primary" size={18} />
            My Referral Network
          </CardTitle>
          <LinkButton 
            onClick={() => router.push("/citizen/referrals")} 
            label="Details" 
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Horizontal Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-bg/50 border border-border/50 rounded-2xl">
            <span className="text-xl font-display font-black text-text-muted">
              {stats.totalInvited}
            </span>
            <p className="text-[10px] text-text-muted/80 font-bold uppercase tracking-wider mt-1">
              Invited
            </p>
          </div>
          <div className="p-3 bg-bg/50 border border-border/50 rounded-2xl">
            <span className="text-xl font-display font-black text-primary">
              {stats.joinedCount}
            </span>
            <p className="text-[10px] text-text-muted/80 font-bold uppercase tracking-wider mt-1">
              Registered
            </p>
          </div>
          <div className="p-3 bg-bg/50 border border-border/50 rounded-2xl">
            <span className="text-xl font-display font-black text-green-600">
              {stats.activeDonorsCount}
            </span>
            <p className="text-[10px] text-text-muted/80 font-bold uppercase tracking-wider mt-1">
              Donors
            </p>
          </div>
        </div>

        {/* Milestone eligibility progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text-muted">Volunteer Qualification</span>
            <span className="text-primary font-bold">{stats.joinedCount} / {targetJoined} Joined</span>
          </div>
          
          <div className="relative w-full h-2.5 bg-bg rounded-full overflow-hidden border border-border">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-primary rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed font-medium">
            {progressPercent >= 100 
              ? "🎉 You have reached the referral target! You are eligible to apply as a volunteer."
              : `Earn volunteer eligibility by getting ${targetJoined - stats.joinedCount} more friends to register.`}
          </p>
        </div>

        {/* Buttons */}
        <Button
          onClick={onInviteClick}
          fullWidth
          className="bg-primary/5 border border-primary/20 hover:bg-primary/10 text-primary font-bold gap-2 py-3 rounded-2xl h-auto transition-all"
        >
          <Users size={16} />
          Invite More Friends
        </Button>
      </CardContent>
    </Card>
  );
}

// Internal inline link button to save file length and imports
function LinkButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button 
      variant="link"
      size="sm"
      onClick={onClick}
      className="inline-flex items-center gap-0.5 text-[12px] font-bold text-primary hover:text-primary/80 p-0 h-auto border-none shadow-none"
      aria-label="Navigate to full referral details"
    >
      {label}
      <ArrowRight size={12} />
    </Button>
  );
}
