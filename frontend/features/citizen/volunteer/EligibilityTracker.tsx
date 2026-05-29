"use client";

import { VolunteerEligibility } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, Circle, Share2, Award, Users } from "lucide-react";

interface EligibilityTrackerProps {
  eligibility: VolunteerEligibility;
}

export default function EligibilityTracker({ eligibility }: EligibilityTrackerProps) {
  const steps = [
    {
      title: "Invite 10+ Neighbors",
      description: "Send invitation links to friends to register.",
      current: eligibility.total_referrals,
      target: eligibility.required_referrals,
      isDone: eligibility.total_referrals >= eligibility.required_referrals,
      icon: Share2,
      color: "text-blue-500 bg-blue-50 border-blue-100"
    },
    {
      title: "10+ Successfully Joined",
      description: "Invited friends complete sign up as Smart Citizens.",
      current: eligibility.total_referrals,
      target: eligibility.required_referrals,
      isDone: eligibility.total_referrals >= eligibility.required_referrals,
      icon: Users,
      color: "text-purple-500 bg-purple-50 border-purple-100"
    },
    {
      title: `${eligibility.required_payments}+ Referred Donations Completed`,
      description: `Referred friends complete at least ${eligibility.required_payments} direct impact support payments.`,
      current: eligibility.referral_payment_count,
      target: eligibility.required_payments,
      isDone: eligibility.referral_payment_count >= eligibility.required_payments,
      icon: Award,
      color: "text-amber-500 bg-amber-50 border-amber-100"
    }
  ];

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="font-display text-2xl font-black text-text">
          Volunteer Eligibility Gating
        </CardTitle>
        <p className="text-text-muted text-sm max-w-md mx-auto mt-1 leading-relaxed">
          To maintain grassroots quality, coordinator roles are open to citizens who actively grow and verify their local network.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-4">
        {/* Step List */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-3xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                  step.isDone 
                    ? "bg-emerald-50/20 border-emerald-100/50" 
                    : "bg-bg/40 border-border/80"
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  <div className={`p-2.5 rounded-2xl border ${step.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold leading-tight ${step.isDone ? "text-emerald-950" : "text-text"}`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-text-muted leading-relaxed font-medium mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-xs font-mono font-bold ${step.isDone ? "text-emerald-700" : "text-text-muted"}`}>
                    {step.current} / {step.target}
                  </span>
                  {step.isDone ? (
                    <Badge variant="success" size="xs">
                      Done
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="xs">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 text-center text-xs font-bold text-primary">
          Checklist status: {eligibility.is_eligible ? "🔓 Gating Unlocked! Please fill out the application below." : "🔒 Complete the checklist above to unlock the volunteer coordinator form."}
        </div>
      </CardContent>
    </Card>
  );
}
