"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Calendar, ArrowRight, ShieldAlert, Award } from "lucide-react";

interface ApplicationStatusProps {
  status: 'pending' | 'approved' | 'rejected';
}

export default function ApplicationStatus({ status }: ApplicationStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "approved":
        return {
          badge: "success",
          title: "Application Approved!",
          desc: "Congratulations! You are now a verified citizen coordinator. Check your profile for special permissions.",
          icon: ShieldCheck,
          color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          textColor: "text-emerald-950"
        };
      case "rejected":
        return {
          badge: "danger",
          title: "Application Declined",
          desc: "Unfortunately, your application does not meet our active coordinator guidelines at this time. Please contact help desk.",
          icon: ShieldAlert,
          color: "bg-rose-50 text-rose-600 border-rose-100",
          textColor: "text-rose-950"
        };
      default:
        return {
          badge: "warning",
          title: "Application Under Review",
          desc: "Our Mumbai District Coordinator team is currently reviewing your professional profile. We will update you in 3-5 working days.",
          icon: Award,
          color: "bg-amber-50 text-amber-600 border-amber-100",
          textColor: "text-amber-950"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm max-w-2xl mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-4">
          <Icon size={28} />
        </div>
        <CardTitle className="font-display text-2xl font-black text-text">
          Volunteer Application Status
        </CardTitle>
        <div className="mt-2 flex justify-center">
          <Badge variant={config.badge as any} className="font-bold text-[10px] uppercase tracking-wider px-3 py-0.5">
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4 text-center">
        <div className={`p-5 rounded-3xl border ${config.color} max-w-md mx-auto`}>
          <h4 className="font-bold text-sm leading-snug">
            {config.title}
          </h4>
          <p className="text-[11px] leading-relaxed font-medium mt-1">
            {config.desc}
          </p>
        </div>

        {/* Timeline Log */}
        <div className="max-w-xs mx-auto border-t border-border pt-6 space-y-4 text-left">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1">Status Timeline</span>
          
          <div className="relative border-l border-border pl-6 ml-3 space-y-5">
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white font-mono text-[9px] font-bold">
                1
              </span>
              <p className="text-xs font-bold text-text">Gating Criteria Met</p>
              <p className="text-[10px] text-text-muted mt-0.5">Checked & verified referral network</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white font-mono text-[9px] font-bold">
                2
              </span>
              <p className="text-xs font-bold text-text">Form Received</p>
              <p className="text-[10px] text-text-muted mt-0.5">Experience & motivation logged</p>
            </div>

            <div className="relative">
              <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full font-mono text-[9px] font-bold ${
                status !== "pending" ? "bg-primary text-white" : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}>
                3
              </span>
              <p className="text-xs font-bold text-text">Regional Verification</p>
              <p className="text-[10px] text-text-muted mt-0.5">
                {status === "approved" ? "Coordinator credentials set up" : status === "rejected" ? "Guidelines not fully met" : "Mumbai District review in progress"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
