"use client";

import { VolunteerEligibility } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, CheckCircle, ChevronRight, Lock, Sparkles, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EligibilityTrackerProps {
  eligibility: VolunteerEligibility | null;
}

export default function EligibilityTracker({ eligibility }: EligibilityTrackerProps) {
  const router = useRouter();

  if (!eligibility) return null;

  const targetJoined = eligibility.requiredJoined;
  const progressPercent = Math.min(Math.round((eligibility.joinedCount / targetJoined) * 100), 100);

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />

      <CardHeader className="pb-4">
        <CardTitle className="font-display text-xl font-black text-text flex items-center gap-2">
          <Lock className="text-primary" size={20} />
          Volunteer Eligibility
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Explanation Alert */}
        <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 flex gap-3.5">
          <Sparkles className="text-primary shrink-0 mt-0.5" size={18} />
          <div className="text-xs text-text-muted leading-relaxed font-semibold">
            <span className="font-bold text-primary">Prerequisite Milestone:</span> To apply as a volunteer, you must demonstrate community involvement by inviting at least 10 people who successfully register as Smart Citizens.
          </div>
        </div>

        {/* Circular / Linear Progress indicator */}
        <div className="space-y-3 p-5 bg-bg/40 border border-border/80 rounded-3xl">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-text-muted">Invite Registered Progress</span>
            <span className="text-primary">{eligibility.joinedCount} / {targetJoined} Joined</span>
          </div>

          <div className="relative w-full h-3 bg-bg rounded-full overflow-hidden border border-border">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-primary rounded-full transition-all duration-700" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
            {progressPercent >= 100 
              ? "🎉 Complete! You have successfully referred 10+ active citizens. The application is now unlocked."
              : `You need ${targetJoined - eligibility.joinedCount} more registered referrals to apply.`}
          </p>
        </div>

        {/* Steps Check list */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Application Steps</h4>
          
          <div className="space-y-2 text-xs">
            {/* Step 1 */}
            <div className="flex items-center gap-3 p-3.5 bg-bg/25 border border-border rounded-2xl">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                eligibility.invitedCount >= 10 
                  ? "bg-green-100 text-green-700" 
                  : "bg-primary/10 text-primary"
              }`}>
                {eligibility.invitedCount >= 10 ? <CheckCircle size={14} /> : "1"}
              </span>
              <div className="flex-1">
                <p className="font-bold text-text">Invite 10+ people via your code</p>
                <p className="text-[10px] text-text-muted font-medium mt-0.5">Currently invited: {eligibility.invitedCount} people</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 p-3.5 bg-bg/25 border border-border rounded-2xl">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                eligibility.joinedCount >= 10 
                  ? "bg-green-100 text-green-700" 
                  : "bg-primary/10 text-primary"
              }`}>
                {eligibility.joinedCount >= 10 ? <CheckCircle size={14} /> : "2"}
              </span>
              <div className="flex-1">
                <p className="font-bold text-text">Referrals complete registration</p>
                <p className="text-[10px] text-text-muted font-medium mt-0.5">Currently registered: {eligibility.joinedCount} people</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-3 p-3.5 bg-bg/25 border border-border rounded-2xl opacity-60">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">
                3
              </span>
              <div className="flex-1">
                <p className="font-bold text-text">Submit volunteer form</p>
                <p className="text-[10px] text-text-muted font-medium mt-0.5">Select skills, area preferences, and submit details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {progressPercent < 100 ? (
          <Button
            onClick={() => router.push("/citizen/referrals")}
            fullWidth
            className="bg-accent hover:bg-accent/90 text-white font-bold gap-1.5 py-3.5 rounded-2xl h-auto transition-all border-none"
          >
            <Share2 size={16} />
            Go Share Invitation Link
          </Button>
        ) : (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-100 text-center font-bold text-xs uppercase">
            Unlock Complete — Application Available Below
          </div>
        )}
      </CardContent>
    </Card>
  );
}
