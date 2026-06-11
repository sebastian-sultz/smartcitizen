"use client";

import { UserResponse } from "@/features/shared/auth/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Circle, Users, ShieldCheck, Lock, Unlock } from "lucide-react";
import Link from "next/link";

interface ReferralProgressProps {
  user: UserResponse | null;
}

export default function ReferralProgress({ user }: ReferralProgressProps) {
  if (!user) return null;

  const totalReferrals = user.total_referrals;
  const paymentCount = user.referral_payment_count;

  const isReferralDone = totalReferrals >= 10;
  const isPaymentDone = paymentCount >= 10;
  const isEligible = isReferralDone && isPaymentDone;

  const referralProgress = Math.min(100, Math.round((totalReferrals / 10) * 100));
  const paymentProgress = Math.min(100, Math.round((paymentCount / 10) * 100));

  return (
    <Card className="rounded-[32px] border border-border/80 shadow-sm bg-white flex flex-col justify-between h-full">
      <div>
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
            {isEligible ? (
              <Unlock size={20} className="text-emerald-500" />
            ) : (
              <Lock size={20} className="text-amber-500" />
            )}
            Volunteer Coordinator Progress
          </CardTitle>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Grow and verify your community network to unlock the volunteer application gating criteria.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Requirement 1: Referrals */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-text flex items-center gap-1.5">
                <Users size={14} className="text-primary" />
                10 Referral Joins
              </span>
              <span className="text-primary font-mono">{totalReferrals} / 10</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isReferralDone ? "bg-emerald-500" : "bg-primary"
                }`}
                style={{ width: `${referralProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-text-muted">
              <span>Verified accounts signed up</span>
              {isReferralDone ? (
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> Completed
                </span>
              ) : (
                <span>{Math.max(0, 10 - totalReferrals)} more required</span>
              )}
            </div>
          </div>

          {/* Requirement 2: Referral Payments */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-text flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary" />
                10 Referred Payments
              </span>
              <span className="text-primary font-mono">{paymentCount} / 10</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isPaymentDone ? "bg-emerald-500" : "bg-primary"
                }`}
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-text-muted">
              <span>Referred friends completing donations</span>
              {isPaymentDone ? (
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> Completed
                </span>
              ) : (
                <span>{Math.max(0, 10 - paymentCount)} more required</span>
              )}
            </div>
          </div>

          {/* Action Status Banner */}
          <div className="pt-2">
            {isEligible ? (
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-3">
                <div className="flex items-start gap-2 text-xs font-medium text-emerald-800 leading-relaxed">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-950">Gating Criteria Unlocked!</p>
                    <p className="text-[11px] mt-0.5">You have met all referral and contribution milestones required to apply as a coordinator.</p>
                  </div>
                </div>
                <Button variant="success" size="sm" fullWidth asChild>
                  <Link href="/citizen/volunteer">Apply Now</Link>
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-border/80 rounded-2xl flex items-start gap-2.5">
                <Circle size={16} className="text-text-muted shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-text">Gating Status: Locked</p>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed font-medium">
                    Complete both network growth milestones above to unlock the volunteer coordinator hub and submit your application.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
