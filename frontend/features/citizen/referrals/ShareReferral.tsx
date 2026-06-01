"use client";

import { useState } from "react";
import { UserResponse } from "@/features/shared/auth/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Copy, Send, Mail, QrCode, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareReferralProps {
  user: UserResponse | null;
  referralLink: string;
}

export default function ShareReferral({ user, referralLink }: ShareReferralProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!user) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success("Referral link copied.");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Join me at the GlobalSmart Citizens Foundation! Sign up using my referral link: ${referralLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleEmailShare = () => {
    const subject = "Join GlobalSmart Citizens Foundation";
    const body = `Hi,\n\nI invite you to join the GlobalSmart Citizens Foundation.\n\nSign up using my link: ${referralLink}\n\nBest,`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <Card className="rounded-[32px] border border-border/80 shadow-sm bg-white flex flex-col justify-between h-full">
      <div>
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
            <Share2 size={20} className="text-primary" />
            Sharing Hub
          </CardTitle>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Invite friends using your custom referral link or QR code to build your network.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Referral URL Copy Input */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-text-muted">Invitation Link</span>
            <div className="flex gap-2">
              <div className="flex-1 bg-bg px-4 py-3 rounded-xl border border-border text-sm font-mono text-text-muted truncate select-all leading-relaxed">
                {referralLink}
              </div>
              <Button
                onClick={handleCopyLink}
                variant="secondary"
                className="bg-primary/10 text-primary border-none hover:bg-primary/20 px-4 py-3 h-auto rounded-xl shrink-0 flex items-center justify-center"
                title="Copy link"
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          {/* QR Code and Social Sharing Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* QR Code Column */}
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-white p-3 rounded-2xl border border-border shadow-sm">
                <QRCodeSVG
                  value={referralLink}
                  size={100}
                  level="Q"
                  fgColor="#0A5C52"
                  includeMargin={true}
                />
              </div>
              <div>
                <p className="text-xs font-bold text-text flex items-center justify-center gap-1">
                  <QrCode size={13} className="text-primary" />
                  Referral QR Code
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 max-w-[140px] mx-auto leading-relaxed">
                  Scan directly from your screen to sign up.
                </p>
              </div>
            </div>

            {/* Social Share Column */}
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Direct Share
                </span>
                <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed font-medium">
                  Instantly distribute your link through email or WhatsApp.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleWhatsAppShare}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 py-2.5 text-xs rounded-xl border-none w-full flex items-center justify-center leading-none"
                >
                  <Send size={13} />
                  WhatsApp
                </Button>
                <Button
                  onClick={handleEmailShare}
                  variant="outline"
                  className="border-border hover:bg-bg text-text font-bold gap-2 py-2.5 text-xs rounded-xl w-full flex items-center justify-center leading-none"
                >
                  <Mail size={13} />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
