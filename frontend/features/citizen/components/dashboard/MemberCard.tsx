"use client";

import { useState } from "react";
import { UserResponse } from "@/features/auth/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QRCodeSVG } from "qrcode.react";
import { User, Phone, Calendar, Award, QrCode } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

interface MemberCardProps {
  profile: UserResponse | null;
}

export default function MemberCard({ profile }: MemberCardProps) {
  const [showQRModal, setShowQRModal] = useState(false);

  const referralCode = profile?.referral_id || `GSC-${profile?.id?.substring(0, 6).toUpperCase()}`;
  const memberId = `SC-${profile?.id?.substring(0, 8).toUpperCase() || "MEMBER"}`;
  
  const formattedDate = profile?.created_at
    ? formatDate(profile.created_at, "short")
    : "";

  const qrValue = JSON.stringify({
    name: profile?.name,
    memberId: memberId,
    referralCode: referralCode,
    status: "Active",
  });

  return (
    <Card className="shadow-card border-primary/10 overflow-hidden relative rounded-[40px]">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-primary/20 to-primary/5 pointer-events-none" />
      
      <CardContent className="pt-10 pb-8 px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <div className="relative w-28 h-28 rounded-full bg-white border-4 border-white shadow-xl mb-4 overflow-hidden group">
            {profile?.profile_photo ? (
              <Image 
                src={profile.profile_photo} 
                alt={profile.name || "Member Photo"} 
                fill
                sizes="112px"
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                <User size={48} className="opacity-30" />
              </div>
            )}
          </div>

          <h2 className="font-display text-2xl font-bold text-text mb-1">
            {profile?.name || "Smart Citizen"}
          </h2>
          
          <p className="text-primary font-mono font-bold tracking-wider text-sm mb-3">
            {memberId}
          </p>

          <div className="flex gap-2 mb-6">
            <Badge variant="success" className="font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-wide">
              Active Member
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-wide">
              {profile?.user_type === "admin" ? "Admin" : "Smart Citizen"}
            </Badge>
          </div>

          <div className="w-full border-t border-dashed border-border my-4" />

          <div className="w-full space-y-3.5 text-left text-sm text-text-muted">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Phone size={15} className="text-primary/70" />
                <span>Mobile</span>
              </span>
              <span className="font-semibold text-text">{profile?.phone || "Not Set"}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar size={15} className="text-primary/70" />
                <span>Member Since</span>
              </span>
              <span className="font-semibold text-text">{formattedDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award size={15} className="text-primary/70" />
                <span>Impact Level</span>
              </span>
              <span className="font-semibold text-text text-primary">
                {(profile?.total_payments ?? 0) > 5 ? "Level 3 (Elite)" : (profile?.total_payments ?? 0) > 1 ? "Level 2 (Regular)" : "Level 1 (Novice)"}
              </span>
            </div>
          </div>

          <div className="w-full border-t border-dashed border-border my-4" />

          <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
            <DialogTrigger asChild>
              <Button 
                variant="secondary"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-bg hover:bg-primary/5 text-primary text-sm font-bold rounded-2xl border border-primary/15 transition-all shadow-sm group"
                aria-label="View Identification QR Code"
              >
                <QrCode size={16} className="group-hover:scale-110 transition-transform" />
                Digital Membership ID
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-sm rounded-[32px] p-6 text-center">
              <DialogHeader>
                <DialogTitle className="font-display font-bold text-lg text-text">
                  Digital Membership ID
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-4 space-y-4">
                <div className="bg-white p-4 rounded-3xl border border-border shadow-md">
                  <QRCodeSVG 
                    value={qrValue} 
                    size={180} 
                    level="Q" 
                    includeMargin={true}
                    fgColor="#0A5C52"
                  />
                </div>
                <div>
                  <p className="font-display font-bold text-text text-base">{profile?.name}</p>
                  <p className="text-[12px] font-mono text-text-muted mt-1">{memberId}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-2 px-2.5 py-0.5 bg-primary/5 rounded-full inline-block">
                    Verified GlobalSmart Citizen
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </CardContent>
    </Card>
  );
}
