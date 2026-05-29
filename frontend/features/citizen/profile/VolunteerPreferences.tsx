"use client";

import { MemberProfile } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Award, ArrowRight, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface VolunteerPreferencesProps {
  profile: MemberProfile;
  volunteerStatus: 'not_applied' | 'pending' | 'approved' | 'rejected';
}

export default function VolunteerPreferences({ profile, volunteerStatus }: VolunteerPreferencesProps) {
  const router = useRouter();

  const isVolunteer = volunteerStatus === "approved";

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <Award size={20} className="text-primary" />
          Volunteer Affiliations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVolunteer ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/40 border border-emerald-100/50 rounded-3xl flex gap-3.5 items-start">
              <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-emerald-950">Verified Coordinator Status</span>
                  <Badge variant="success" size="sm">
                    Approved
                  </Badge>
                </div>
                <p className="text-[12px] text-emerald-800/80 leading-relaxed mt-1">
                  You are a registered volunteer for the Mumbai City district. You have permission to coordinate and check in attendees for regional cleanup and education drives.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-bg border border-border/80 rounded-2xl space-y-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Availability</span>
                <p className="text-sm font-bold text-text">Weekends (Flexible)</p>
              </div>
              <div className="p-4 bg-bg border border-border/80 rounded-2xl space-y-1">
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Preferred Track</span>
                <p className="text-sm font-bold text-text">Environment & Tree Planting</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/0 border border-primary/10 rounded-3xl space-y-4 text-center sm:text-left relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-4 translate-y-4">
              <Heart size={140} />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={11} />
                Elevate Your Impact
              </div>
              <h4 className="font-display font-black text-text text-base leading-snug">
                Become a Verified NGO Volunteer
              </h4>
              <p className="text-text-muted text-xs leading-relaxed max-w-md">
                Coordinators organize local beach cleanups, distribute education kits, support municipal legal aid camps, and receive official certificates.
              </p>
            </div>

            {volunteerStatus === "pending" ? (
              <div className="p-3 bg-amber-50 text-amber-800 border border-amber-100 rounded-2xl text-xs text-center font-bold">
                Application Review Pending — We'll notify you soon.
              </div>
            ) : volunteerStatus === "rejected" ? (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-2xl text-xs text-center font-bold">
                Status: Gating checklist not fully met. Keep inviting!
              </div>
            ) : (
              <Button
                onClick={() => router.push("/citizen/volunteer")}
                className="w-full sm:w-auto text-xs font-bold py-2.5 px-5 h-auto rounded-xl gap-1.5 shadow-sm"
              >
                Start Gated Application
                <ArrowRight size={13} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
