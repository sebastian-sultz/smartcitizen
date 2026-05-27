"use client";

import { DashboardStats } from "../../types";
import { Card } from "@/components/ui/Card";
import { 
  Heart, 
  Users, 
  Flag, 
  Award, 
  Calendar, 
  ShieldCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  stats: DashboardStats | null;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) return null;

  const getVolunteerStatusLabel = (status: DashboardStats["volunteerStatus"]) => {
    switch (status) {
      case "approved": return "Approved Volunteer";
      case "pending": return "Review Pending";
      case "rejected": return "Not Eligible";
      default: return "Apply to Volunteer";
    }
  };

  const getVolunteerStatusColor = (status: DashboardStats["volunteerStatus"]) => {
    switch (status) {
      case "approved": return "from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-600";
      case "pending": return "from-amber-50 to-amber-100/50 border-amber-100 text-amber-600";
      case "rejected": return "from-rose-50 to-rose-100/50 border-rose-100 text-rose-600";
      default: return "from-slate-50 to-slate-100/50 border-slate-100 text-slate-600";
    }
  };

  const statCards = [
    {
      title: "Total Donated",
      value: `₹${stats.totalDonated.toLocaleString("en-IN")}`,
      icon: Heart,
      colorClass: "from-rose-50 to-rose-100/50 border-rose-100 text-rose-600",
      valueClass: "text-rose-900",
      label: "Direct Impact contributions",
    },
    {
      title: "Referred Network",
      value: stats.totalReferrals.toString(),
      icon: Users,
      colorClass: "from-blue-50 to-blue-100/50 border-blue-100 text-blue-600",
      valueClass: "text-blue-900",
      label: "Citizens registered via you",
    },
    {
      title: "Campaigns Joined",
      value: stats.campaignsJoined.toString(),
      icon: Flag,
      colorClass: "from-emerald-50 to-emerald-100/50 border-emerald-100 text-emerald-600",
      valueClass: "text-emerald-900",
      label: "Active citizen initiatives",
    },
    {
      title: "Badge Level",
      value: stats.badgeLevel,
      icon: Award,
      colorClass: "from-purple-50 to-purple-100/50 border-purple-100 text-purple-600",
      valueClass: "text-purple-900",
      label: "Earned citizen status",
    },
    {
      title: "Events Attended",
      value: stats.eventsAttended.toString(),
      icon: Calendar,
      colorClass: "from-indigo-50 to-indigo-100/50 border-indigo-100 text-indigo-600",
      valueClass: "text-indigo-900",
      label: "Field drives & assemblies",
    },
    {
      title: "Volunteer Status",
      value: getVolunteerStatusLabel(stats.volunteerStatus),
      icon: ShieldCheck,
      colorClass: getVolunteerStatusColor(stats.volunteerStatus),
      valueClass: `text-sm font-bold tracking-tight py-2.5 ${
        stats.volunteerStatus === 'approved' ? 'text-emerald-900' :
        stats.volunteerStatus === 'pending' ? 'text-amber-900' :
        stats.volunteerStatus === 'rejected' ? 'text-rose-900' : 'text-slate-900'
      }`,
      label: "Special operations eligibility",
      isVolunteerField: true
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card 
            key={idx} 
            className={cn(
              "bg-gradient-to-br border shadow-sm p-6 flex flex-col justify-between rounded-3xl",
              card.colorClass
            )}
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider opacity-85 text-text-muted">
                {card.title}
              </span>
              <Icon size={22} className="opacity-90 shrink-0" />
            </div>
            
            <div className="mt-4">
              {card.isVolunteerField ? (
                <div className={cn("text-base font-bold", card.valueClass)}>
                  {card.value}
                </div>
              ) : (
                <div className={cn("text-2xl md:text-3xl font-display font-black leading-none", card.valueClass)}>
                  {card.value}
                </div>
              )}
              <p className="text-[11px] opacity-75 font-medium mt-1">
                {card.label}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
