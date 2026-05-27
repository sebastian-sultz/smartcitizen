"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, Clock, XCircle, AlertTriangle, ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface ApplicationStatusProps {
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  onReapply?: () => void;
}

export default function ApplicationStatus({ status, adminFeedback, onReapply }: ApplicationStatusProps) {
  const router = useRouter();

  const getStatusConfig = () => {
    switch (status) {
      case "approved":
        return {
          icon: ShieldCheck,
          iconColor: "text-emerald-500 bg-emerald-50 border-emerald-100",
          badge: <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wider">Approved Volunteer</Badge>,
          title: "Application Approved!",
          desc: "Congratulations! Your application has been approved by the local coordination team. You are now a verified volunteer.",
        };
      case "rejected":
        return {
          icon: XCircle,
          iconColor: "text-rose-500 bg-rose-50 border-rose-100",
          badge: <Badge variant="destructive" className="font-bold text-[9px] uppercase tracking-wider">Rejected</Badge>,
          title: "Application Declined",
          desc: "We appreciate your interest. However, your volunteer application could not be approved at this time.",
        };
      default:
        return {
          icon: Clock,
          iconColor: "text-amber-500 bg-amber-50 border-amber-100",
          badge: <Badge variant="warning" className="bg-amber-100 text-amber-700 border-none font-bold text-[9px] uppercase tracking-wider">Pending Review</Badge>,
          title: "Under Administrative Review",
          desc: "Your coordinate registration and capabilities are currently being evaluated by the block leader.",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden">
      <CardContent className="p-8 space-y-6">
        
        {/* Status header card */}
        <div className="flex flex-col items-center text-center p-6 bg-bg/40 border border-border/80 rounded-3xl space-y-3.5">
          <span className={`p-4 rounded-full border-2 ${config.iconColor} shrink-0`}>
            <Icon size={28} />
          </span>
          <div className="space-y-1">
            <div className="flex justify-center mb-2">{config.badge}</div>
            <h3 className="font-display font-black text-lg text-text">{config.title}</h3>
            <p className="text-xs text-text-muted max-w-sm leading-relaxed font-semibold">{config.desc}</p>
          </div>
        </div>

        {/* Feedback Alert for rejection */}
        {status === "rejected" && adminFeedback && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 text-xs text-rose-900 leading-relaxed font-medium">
            <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={16} />
            <div>
              <span className="font-bold">Reviewer Remarks:</span> {adminFeedback}
            </div>
          </div>
        )}

        {/* Timeline details */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Application Timeline</h4>
          
          <div className="space-y-4 relative pl-5 border-l border-border ml-2.5 text-[11px] font-medium">
            <div className="relative">
              <span className="absolute -left-[27px] top-0.5 bg-white rounded-full p-0.5">
                <CheckCircle className="text-primary" size={14} />
              </span>
              <p className="text-text font-bold">Eligibility Target Met</p>
              <p className="text-text-muted text-[10px]">Successfully referred 10 active citizens</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[27px] top-0.5 bg-white rounded-full p-0.5">
                <CheckCircle className="text-primary" size={14} />
              </span>
              <p className="text-text font-bold">Application Submitted</p>
              <p className="text-text-muted text-[10px]">Forms and availability indices successfully logged</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[27px] top-0.5 bg-white rounded-full p-0.5">
                {status === "approved" ? (
                  <CheckCircle className="text-emerald-500" size={14} />
                ) : status === "rejected" ? (
                  <XCircle className="text-rose-500" size={14} />
                ) : (
                  <Clock className="text-amber-500 animate-pulse" size={14} />
                )}
              </span>
              <p className="text-text font-bold">Coordination Verification</p>
              <p className="text-text-muted text-[10px]">
                {status === "approved" 
                  ? "Approved by Block Leader" 
                  : status === "rejected" 
                  ? "Declined by Block Leader" 
                  : "Assigned to Block Leader — Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="border-t border-border pt-4 flex justify-end gap-2.5">
          {status === "approved" ? (
            <Button
              onClick={() => router.push("/citizen")}
              className="bg-primary hover:bg-primary/95 text-white font-bold gap-1 py-3 px-6 rounded-2xl h-auto text-xs"
            >
              Go to Dashboard
              <ArrowRight size={14} />
            </Button>
          ) : status === "rejected" ? (
            <Button
              onClick={onReapply}
              className="bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-2xl h-auto text-xs"
            >
              Reapply for Review
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/citizen")}
              className="border-primary/10 text-primary hover:bg-primary/5 font-bold py-3 px-6 rounded-2xl h-auto text-xs"
            >
              Return to Dashboard
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
