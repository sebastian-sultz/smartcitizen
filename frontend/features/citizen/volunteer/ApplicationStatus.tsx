"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ApplicationStatus() {
  const router = useRouter();

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm max-w-2xl mx-auto overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-r from-emerald-500/10 to-teal-500/5" />
      
      <CardHeader className="text-center pb-2 pt-10 relative z-10">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-sm">
          <UserCheck size={28} />
        </div>
        <CardTitle className="font-display text-2xl font-black text-text">
          Verified Volunteer Coordinator
        </CardTitle>
        <div className="mt-2 flex justify-center">
          <Badge variant="success" size="md" className="px-3">
            Active Status
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-4 pb-8 relative z-10 text-center">
        <div className="p-5 rounded-3xl border border-emerald-100 bg-emerald-50/30 max-w-md mx-auto">
          <h4 className="font-bold text-sm text-emerald-950 leading-snug">
            Welcome to the Coordinator Team!
          </h4>
          <p className="text-[12px] leading-relaxed text-emerald-800 font-medium mt-1">
            Thank you for growing the grassroots network. Your profile has been upgraded with regional coordination permissions.
          </p>
        </div>

        {/* Real Permissions list */}
        <div className="max-w-md mx-auto border-t border-border pt-6 text-left space-y-4">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1">
            Your Account Privileges
          </span>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-bg border border-border/60">
              <ShieldCheck className="text-primary mt-0.5 shrink-0" size={16} />
              <div>
                <p className="text-xs font-bold text-text">Regional Assembly Coordination</p>
                <p className="text-[10px] text-text-muted mt-0.5">Organize and manage neighborhood assemblies, beach cleanups, and drives.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-bg border border-border/60">
              <ShieldCheck className="text-primary mt-0.5 shrink-0" size={16} />
              <div>
                <p className="text-xs font-bold text-text">Attendee Registration & QR Scans</p>
                <p className="text-[10px] text-text-muted mt-0.5">Check in registered smart citizens and scan digital membership IDs at drives.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Button
            onClick={() => router.push("/citizen/dashboard")}
            variant="outline"
            className="w-full sm:w-auto text-xs font-bold py-2.5 px-6 rounded-xl"
          >
            Go to Dashboard
          </Button>
          
          <Button
            onClick={() => router.push("/citizen/profile")}
            variant="primary"
            className="w-full sm:w-auto text-xs font-bold py-2.5 px-6 rounded-xl"
          >
            Manage Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
