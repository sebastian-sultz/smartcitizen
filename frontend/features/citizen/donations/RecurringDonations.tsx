"use client";

import { useState } from "react";
import { RecurringDonation } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar, CreditCard, Heart, AlertTriangle } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { useAlert } from "@/components/ui/AlertProvider";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

interface RecurringDonationsProps {
  plans: RecurringDonation[];
  onCancelPlan?: (id: string) => void;
}

export default function RecurringDonations({ plans, onCancelPlan }: RecurringDonationsProps) {
  const { showConfirm } = useAlert();
  const [localPlans, setLocalPlans] = useState<RecurringDonation[]>(plans);

  const handleCancelClick = (plan: RecurringDonation) => {
    showConfirm({
      title: "Cancel Recurring Mandate?",
      message: `Are you sure you want to cancel your monthly donation of ₹${plan.amount} for "${plan.purpose}"? This action cannot be undone.`,
      confirmText: "Cancel Mandate",
      cancelText: "Keep Supporting",
      type: "error",
      onConfirm: () => {
        setLocalPlans(localPlans.filter((p) => p.id !== plan.id));
        if (onCancelPlan) onCancelPlan(plan.id);
        toast.success("Recurring support mandate cancelled successfully.");
      },
    });
  };

  if (localPlans.length === 0) {
    return (
      <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden">
        <CardContent className="p-8">
          <EmptyState
            icon={Heart}
            title="No recurring donations"
            description="Set up automatic monthly or quarterly support to maintain our tree plantations and school programs."
            ctaText="Establish Recurring Support"
            ctaHref="/donation"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-lg font-bold text-text">Recurring Support Plans</h3>
        <p className="text-text-muted text-xs mt-0.5 font-medium">Automatic card mandates powering regional development chapters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localPlans.map((plan) => (
          <Card key={plan.id} className="rounded-[32px] border-primary/5 shadow-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                    {plan.frequency} Subscription
                  </span>
                  <h4 className="text-xl font-display font-black text-primary">
                    ₹{plan.amount}
                  </h4>
                </div>
                <Badge variant={plan.status === "active" ? "success" : "warning"} className="font-bold text-[9px] uppercase px-2 py-0.5">
                  {plan.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs font-medium text-text-muted">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary/70 shrink-0" />
                  <span>Next Charge: {formatDate(plan.nextBillingDate, "medium")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-primary/70 shrink-0" />
                  <span>Funding Source: {plan.paymentMethod}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-rose-500 shrink-0" fill="currentColor" />
                  <span className="text-text font-bold truncate">Allocated: {plan.purpose}</span>
                </div>
              </div>

              <div className="w-full border-t border-border/50 pt-4 flex gap-2">
                <Button
                  onClick={() => handleCancelClick(plan)}
                  variant="ghost-danger"
                  className="w-full text-xs font-bold py-2.5 h-auto rounded-xl gap-1.5"
                >
                  <AlertTriangle size={13} />
                  Cancel Mandate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
