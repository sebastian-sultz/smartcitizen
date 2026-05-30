"use client";

import { useState } from "react";
import { ReferralStats } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Copy, Send, Mail, QrCode } from "lucide-react";
import { toast } from "sonner";

interface ShareReferralProps {
  stats: ReferralStats | null;
}

export default function ShareReferral({ stats }: ShareReferralProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!stats) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(stats.referral_link);
    setCopiedLink(true);
    toast.success("Referral link copied to clipboard.");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Join me at the GlobalSmart Citizens Foundation! Sign up using my referral link and let's work together to empower communities: ${stats.referral_link}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleEmailShare = () => {
    const subject = "Invitation to Join GlobalSmart Citizens Foundation";
    const body = `Hi,\n\nI invite you to join me in supporting the GlobalSmart Citizens Foundation. Let's work together for clean environment, education, and legal rights.\n\nSign up using my link: ${stats.referral_link}\n\nBest,`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <Share2 size={20} className="text-primary" />
          Sharing Hub
        </CardTitle>
        <p className="text-sm text-text-muted mt-1 font-medium">
          Invite friends using your custom referral code or QR.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* Referral URL Copy Input */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-text-muted">Invitation Link</span>
          <div className="flex gap-2">
            <div className="flex-1 bg-bg p-3.5 rounded-2xl border border-border text-sm font-mono text-text-muted truncate">
              {stats.referral_link}
            </div>
            <Button 
              onClick={handleCopyLink}
              variant="secondary"
              className="bg-primary/10 text-primary border-none hover:bg-primary/20 p-3.5 h-auto rounded-2xl shrink-0"
              title="Copy link"
            >
              <Copy size={16} />
            </Button>
          </div>
        </div>

        {/* Grid split: QR generator & Social Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* QR Code Container */}
          <div className="p-5 bg-bg/40 border border-border/80 rounded-3xl flex flex-col items-center justify-center text-center space-y-3.5">
            <div className="bg-white p-3.5 rounded-2xl border border-border shadow-sm">
              <QRCodeSVG 
                value={stats.referral_link} 
                size={110} 
                level="Q" 
                fgColor="#0A5C52"
                includeMargin={true}
              />
            </div>
            <div>
              <p className="text-xs font-bold text-text flex items-center justify-center gap-1.5">
                <QrCode size={14} className="text-primary" />
                Referral QR Code
              </p>
              <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                Friends can scan this QR directly from your dashboard to sign up.
              </p>
            </div>
          </div>

          {/* Social Preview Mockup Card */}
          <div className="p-5 bg-bg/40 border border-border/80 rounded-3xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[9px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 uppercase tracking-wider">
                Post Mockup Preview
              </span>
              <p className="text-[11px] font-medium text-text-muted mt-3 italic leading-relaxed border-l-2 border-primary/20 pl-3">
                &ldquo;Join me at the GlobalSmart Citizens Foundation! Sign up using my referral link and let's work together to empower communities...&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handleWhatsAppShare}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 py-2.5 text-xs rounded-xl border-none w-full"
              >
                <Send size={13} />
                WhatsApp
              </Button>
              <Button 
                onClick={handleEmailShare}
                variant="outline"
                className="border-border hover:bg-bg text-text font-bold gap-1.5 py-2.5 text-xs rounded-xl w-full"
              >
                <Mail size={13} />
                Email
              </Button>
            </div>
          </div>

        </div>

      </CardContent>
    </Card>
  );
}
