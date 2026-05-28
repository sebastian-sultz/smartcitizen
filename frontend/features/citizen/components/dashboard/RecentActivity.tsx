"use client";

import { ActivityItem } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { 
  Heart, 
  UserPlus, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface RecentActivityProps {
  activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "donation":
        return { icon: Heart, bg: "bg-rose-50 text-rose-500", border: "border-rose-100" };
      case "referral_join":
      case "referral_donate":
        return { icon: UserPlus, bg: "bg-blue-50 text-blue-500", border: "border-blue-100" };
      case "event_register":
        return { icon: Calendar, bg: "bg-indigo-50 text-indigo-500", border: "border-indigo-100" };
      case "volunteer_apply":
        return { icon: ShieldCheck, bg: "bg-emerald-50 text-emerald-500", border: "border-emerald-100" };
      default:
        return { icon: MessageSquare, bg: "bg-amber-50 text-amber-500", border: "border-amber-100" };
    }
  };



  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg font-bold text-text">
            Recent Activities
          </CardTitle>
          <Link 
            href="/citizen/profile" 
            className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Manage Profile
            <ArrowRight size={12} />
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-text-muted">No recent activities found.</p>
          </div>
        ) : (
          <div className="relative border-l border-border pl-6 ml-3 space-y-6">
            {activities.slice(0, 4).map((act) => {
              const { icon: Icon, bg, border } = getActivityIcon(act.type);
              return (
                <div key={act.id} className="relative">
                  <span className={`absolute -left-[37px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-sm ${bg} ${border}`}>
                    <Icon size={12} />
                  </span>
                  
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-text">
                      {act.title}
                    </p>
                    <p className="text-[12px] text-text-muted leading-relaxed font-medium">
                      {act.description}
                    </p>
                    <p className="text-[10px] text-text-muted/70 font-bold font-mono">
                      {formatDate(act.date, "short-time")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
