"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ReferralStats } from "../../types";
import { Share2, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ReferralSummaryWidgetProps {
  stats: ReferralStats | null;
  onInviteClick?: () => void;
}

export default function ReferralSummaryWidget({ stats, onInviteClick }: ReferralSummaryWidgetProps) {
  if (!stats) return null;

  // Let's assume a goal of 10 referred members to unlock Volunteer status
  const target = 10;
  const current = stats.joinedCount;
  const percentage = Math.min(100, Math.round((current / target) * 100));

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-display text-base font-bold text-text flex items-center gap-2">
          <Share2 size={18} className="text-primary" />
          Referral Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-bg/40 p-4 rounded-3xl border border-border/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-text-muted flex items-center gap-1.5">
              <Trophy size={14} className="text-amber-500" />
              Volunteer Gating Goal
            </span>
            <span className="text-xs font-mono font-bold text-primary">
              {current} / {target} Joined
            </span>
          </div>
          
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
            {percentage >= 100 
              ? "🎉 You have reached the goal! You are now eligible to apply for Volunteer roles." 
              : `Invite ${target - current} more friends to successfully join to unlock volunteer preferences.`
            }
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-blue-50/40 border border-blue-100/50 rounded-2xl">
            <p className="text-xl font-display font-black text-blue-900">{stats.totalInvited}</p>
            <p className="text-[10px] text-blue-700/80 font-bold uppercase tracking-wider mt-0.5">Invited</p>
          </div>
          <div className="p-3 bg-emerald-50/40 border border-emerald-100/50 rounded-2xl">
            <p className="text-xl font-display font-black text-emerald-900">{stats.joinedCount}</p>
            <p className="text-[10px] text-emerald-700/80 font-bold uppercase tracking-wider mt-0.5">Joined</p>
          </div>
        </div>

        <Button 
          onClick={onInviteClick}
          variant="outline" 
          className="w-full text-xs font-bold py-2.5 h-auto rounded-xl gap-2 border-primary/20 hover:bg-primary/5 text-primary"
        >
          <Share2 size={14} />
          Invite More Friends
        </Button>
      </CardContent>
    </Card>
  );
}
