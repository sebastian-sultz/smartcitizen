"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShieldAlert, Award, ChevronRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface VolunteerPreferencesProps {
  volunteerStatus: 'not_applied' | 'pending' | 'approved' | 'rejected';
}

export default function VolunteerPreferences({ volunteerStatus }: VolunteerPreferencesProps) {
  const router = useRouter();

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <Award className="text-primary animate-pulse" size={20} />
          Volunteer Preferences
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-between">
        {volunteerStatus === "approved" ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-3xl">
              <span className="p-2 bg-emerald-500 text-white rounded-2xl shrink-0">
                <Check size={18} />
              </span>
              <div>
                <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wider mb-1">
                  Active Volunteer
                </Badge>
                <p className="text-sm font-bold text-emerald-950">You are an Approved Volunteer</p>
              </div>
            </div>

            <div className="space-y-3.5 text-sm text-text-muted">
              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="font-medium">Primary Skillset</span>
                <span className="font-semibold text-text">Community Outreach</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="font-medium">Availability</span>
                <span className="font-semibold text-text">Weekends (4-8 hrs)</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2.5">
                <span className="font-medium">Interests</span>
                <span className="font-semibold text-text">Clean-up & Afforestation</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Preferred Work</span>
                <span className="font-semibold text-text">Field Operations</span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/citizen/volunteer")}
              variant="outline"
              fullWidth
              className="border-primary/10 hover:bg-primary/5 text-primary font-bold py-3.5 rounded-2xl h-auto mt-2"
            >
              Update Preferences
            </Button>
          </div>
        ) : volunteerStatus === "pending" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-3xl">
              <span className="p-2 bg-amber-500 text-white rounded-2xl shrink-0">
                <ShieldAlert size={18} />
              </span>
              <div>
                <Badge variant="warning" className="bg-amber-100 text-amber-700 border-none font-bold text-[9px] uppercase tracking-wider mb-1">
                  Pending Review
                </Badge>
                <p className="text-sm font-bold text-amber-950">Application Pending Review</p>
              </div>
            </div>
            
            <p className="text-xs text-text-muted font-medium leading-relaxed">
              Your application to join the official volunteer force is being evaluated by the district coordinators. We usually review applications within 2-3 business days.
            </p>
            
            <Button
              onClick={() => router.push("/citizen/volunteer")}
              variant="outline"
              fullWidth
              className="border-primary/10 hover:bg-primary/5 text-primary font-bold py-3 rounded-2xl h-auto"
            >
              View Application Details
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 space-y-2">
              <h4 className="font-bold text-sm text-primary">Become a Verified Volunteer</h4>
              <p className="text-xs text-text-muted leading-relaxed font-medium">
                Make a direct physical contribution to local cleanup, plantation, and education campaigns in your district.
              </p>
            </div>
            
            <div className="space-y-2.5 text-xs text-text-muted font-semibold">
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">1</span>
                Invite 10 friends to join GSC
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">2</span>
                Submit availability & preferences
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">3</span>
                Attend local assembly & get badge
              </p>
            </div>

            <Button
              onClick={() => router.push("/citizen/volunteer")}
              fullWidth
              className="bg-primary hover:bg-primary/95 text-white font-bold gap-1 py-3.5 rounded-2xl h-auto mt-2"
            >
              Apply Now
              <ChevronRight size={14} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
