"use client";

import { ReferralStats } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Award, ShieldCheck, Trophy, Sparkles } from "lucide-react";

interface ReferralProgressProps {
  stats: ReferralStats | null;
}

export default function ReferralProgress({ stats }: ReferralProgressProps) {
  if (!stats) return null;

  const current = stats.joinedCount;
  
  // Ranks configuration
  const ranks = [
    { name: "Novice", target: 0, badge: "Bronze Badge", desc: "Start sharing links" },
    { name: "Promoter", target: 5, badge: "Silver Shield", desc: "Unlock volunteer hub options" },
    { name: "Ambassador", target: 15, badge: "Gold Award", desc: "Official regional district coordination" }
  ];

  // Find current and next rank
  let currentRank = ranks[0];
  let nextRank = ranks[1];

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (current >= ranks[i].target) {
      currentRank = ranks[i];
      nextRank = ranks[i + 1] || null;
      break;
    }
  }

  const progressPercentage = nextRank
    ? Math.min(100, Math.round(((current - currentRank.target) / (nextRank.target - currentRank.target)) * 100))
    : 100;

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" />
          Network Milestones
        </CardTitle>
        <p className="text-sm text-text-muted mt-1 font-medium">
          Earn badges and level up your civic coordination ranking.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Rank Banner */}
        <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/0 border border-amber-500/20 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/15 text-amber-700 rounded-2xl">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Current Ranking</p>
              <h4 className="font-display font-black text-text text-base leading-none mt-1">
                NGO {currentRank.name}
              </h4>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-500/10 rounded-full px-3 py-1">
            {currentRank.badge}
          </span>
        </div>

        {/* Milestone Progress Bar */}
        {nextRank && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-text-muted">Progress to {nextRank.name} ({nextRank.badge})</span>
              <span className="text-primary font-mono">{current} / {nextRank.target} Joins</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-text-muted leading-relaxed font-medium">
              Invite <span className="font-bold text-primary">{nextRank.target - current} more friends</span> to successfully register to elevate to {nextRank.name} status.
            </p>
          </div>
        )}

        {/* Milestone Tracks list */}
        <div className="space-y-3 pt-2">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block">Promotion Roadmap</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ranks.map((r, idx) => {
              const active = current >= r.target;
              return (
                <div 
                  key={idx} 
                  className={`p-4 border rounded-2xl space-y-1.5 transition-all duration-300 ${
                    active 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-bg/20 border-border/60 opacity-60"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-primary" : "text-text-muted"}`}>
                      {r.name}
                    </span>
                    {active && <ShieldCheck size={14} className="text-primary" />}
                  </div>
                  <p className="text-sm font-display font-black text-text leading-none">{r.target} Joins</p>
                  <p className="text-[9px] text-text-muted font-medium">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
