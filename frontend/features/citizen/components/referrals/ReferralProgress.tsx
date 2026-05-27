"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Award, Users, CheckCircle2, Circle } from "lucide-react";

interface ReferralProgressProps {
  joinedCount: number;
}

export default function ReferralProgress({ joinedCount }: ReferralProgressProps) {
  // Define gamified ranks based on joined count
  const milestones = [
    { target: 1, label: "First Connection", desc: "Get your first friend to register" },
    { target: 3, label: "Network Promoter", desc: "Build a mini-community of 3 members" },
    { target: 5, label: "Civic Ambassador", desc: "Engage 5 friends in local civic operations" },
    { target: 10, label: "Volunteer Qualified", desc: "Invite 10+ members to unlock application form" },
  ];

  const getActiveRank = () => {
    if (joinedCount >= 10) return { title: "District Champion", color: "text-purple-600 bg-purple-50 border-purple-100" };
    if (joinedCount >= 5) return { title: "Civic Ambassador", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (joinedCount >= 3) return { title: "Network Promoter", color: "text-blue-600 bg-blue-50 border-blue-100" };
    if (joinedCount >= 1) return { title: "Active Citizen", color: "text-amber-600 bg-amber-50 border-amber-100" };
    return { title: "Citizen Novice", color: "text-slate-500 bg-slate-50 border-slate-100" };
  };

  const rank = getActiveRank();

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <Award className="text-primary animate-pulse" size={20} />
          Impact Milestones
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active Rank */}
        <div className={`p-4 border rounded-3xl text-center space-y-1 ${rank.color}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Current Network Rank</span>
          <h4 className="font-display font-black text-lg leading-tight">{rank.title}</h4>
          <p className="text-[10px] font-semibold opacity-70">Based on {joinedCount} registered referrals</p>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-text-muted">Milestone Ladder</h5>
          
          <div className="space-y-4 relative pl-5 border-l border-border ml-2 text-xs font-semibold">
            {milestones.map((m, idx) => {
              const isMet = joinedCount >= m.target;
              return (
                <div key={idx} className="relative">
                  <span className="absolute -left-[27px] top-0.5 bg-white rounded-full p-0.5">
                    {isMet ? (
                      <CheckCircle2 className="text-primary shrink-0" size={14} />
                    ) : (
                      <Circle className="text-text-muted/60 shrink-0" size={14} />
                    )}
                  </span>
                  
                  <div className={isMet ? "text-text" : "text-text-muted/70"}>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{m.label}</p>
                      <Badge 
                        variant={isMet ? "success" : "outline"}
                        className={`text-[8px] px-1.5 py-0 font-bold ${
                          isMet ? "" : "text-text-muted/50 border-border/80"
                        }`}
                      >
                        Target: {m.target}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-text-muted mt-0.5 font-medium">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
