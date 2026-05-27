"use client";

import { useState } from "react";
import { RecurringDonation } from "../../types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertProvider";
import { Heart, Calendar, CreditCard, Play, Pause, Trash2, ArrowRight } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

interface RecurringDonationsProps {
  plans: RecurringDonation[];
  loading: boolean;
  onUpdateStatus?: (id: string, newStatus: 'active' | 'paused' | 'cancelled') => void;
}

export default function RecurringDonations({ plans: initialPlans, loading, onUpdateStatus }: RecurringDonationsProps) {
  const { showAlert } = useAlert();
  const [plans, setPlans] = useState<RecurringDonation[]>(initialPlans);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : ("active" as const);
    
    setPlans(plans.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    if (onUpdateStatus) onUpdateStatus(id, nextStatus);

    showAlert({
      title: nextStatus === "active" ? "Donation Resumed" : "Donation Paused",
      message: `Your monthly contribution has been successfully ${nextStatus === "active" ? "resumed" : "paused"}.`,
      type: "success",
    });
  };

  const handleCancelPlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    if (onUpdateStatus) onUpdateStatus(id, "cancelled");

    showAlert({
      title: "Plan Cancelled",
      message: "Your monthly recurring donation plan has been cancelled.",
      type: "info",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse h-28 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="No Recurring Contribution Plans"
        description="Set up automatic monthly contributions to provide predictable support for our community initiatives."
        ctaText="Configure Monthly Donation"
        ctaHref="/donation"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-text">Active Subscriptions</h3>
        <span className="text-xs text-text-muted font-bold">{plans.length} Active Plans</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => {
          const formattedDate = new Date(plan.nextBillingDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return (
            <Card key={plan.id} className="rounded-3xl border-primary/5 hover:border-primary/10 hover:shadow-sm transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Recurring Donation</span>
                    <h4 className="font-display text-2xl font-black text-primary mt-0.5">
                      ₹{plan.amount.toLocaleString("en-IN")}{" "}
                      <span className="text-xs font-bold text-text-muted">/ {plan.frequency}</span>
                    </h4>
                  </div>
                  <Badge 
                    variant={plan.status === "active" ? "success" : "warning"}
                    className="font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5"
                  >
                    {plan.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-text-muted font-semibold">
                  <div className="flex justify-between border-b border-border/80 pb-2 flex-wrap">
                    <span>Purpose</span>
                    <span className="font-bold text-text">{plan.purpose}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/80 pb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-primary/70" />
                      Next Renewal
                    </span>
                    <span className="font-bold text-text">{formattedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <CreditCard size={13} className="text-primary/70" />
                      Payment Mandate
                    </span>
                    <span className="font-bold text-text">{plan.paymentMethod}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStatus(plan.id, plan.status)}
                    className="px-3.5 py-2 h-auto text-xs font-bold gap-1 rounded-xl border-primary/10 text-primary"
                    aria-label={plan.status === "active" ? "Pause plan" : "Resume plan"}
                  >
                    {plan.status === "active" ? (
                      <>
                        <Pause size={12} />
                        Pause Plan
                      </>
                    ) : (
                      <>
                        <Play size={12} />
                        Resume Plan
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost-danger"
                    onClick={() => handleCancelPlan(plan.id)}
                    className="px-3.5 py-2 h-auto text-xs font-bold gap-1 rounded-xl"
                    aria-label="Cancel plan"
                  >
                    <Trash2 size={12} />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
