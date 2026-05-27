"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, MessageCircle, Mail, Share2, Sparkles, CheckCircle } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";

interface ShareReferralProps {
  referralCode: string;
  referralLink: string;
}

export default function ShareReferral({ referralCode, referralLink }: ShareReferralProps) {
  const { showAlert } = useAlert();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    showAlert({
      title: "Link Copied",
      message: "Your unique invitation link has been copied to your clipboard!",
      type: "success",
    });
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Hey! Join the Global Smart Citizens Foundation to support local cleanup and tree drives. Register using my link: ${referralLink}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Join me at Global Smart Citizen Foundation");
    const body = encodeURIComponent(`Hi,\n\nI joined the Global Smart Citizen Foundation to support community cleanups, education, and disaster relief. Join as a registered member using my link:\n\n${referralLink}\n\nThanks!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-lg font-bold text-text flex items-center gap-2">
          <Share2 className="text-primary animate-pulse" size={20} />
          Invite Connections
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Link Copy utility */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted block">Your Custom Referral URL</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-bg p-3.5 rounded-2xl border border-border text-xs font-mono text-text-muted truncate select-all">
              {referralLink}
            </div>
            <Button
              onClick={handleCopyLink}
              className="bg-primary hover:bg-primary/95 text-white font-bold px-4 rounded-xl h-auto shrink-0 border-none"
              aria-label="Copy invitation link"
            >
              <Copy size={16} />
            </Button>
          </div>
        </div>

        {/* QR Code and Social Sharing Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* QR */}
          <div className="flex flex-col items-center p-4 border border-border bg-bg/25 rounded-3xl text-center space-y-2">
            <QRCodeSVG 
              value={referralLink} 
              size={120} 
              level="M" 
              includeMargin={true}
              fgColor="#0A5C52"
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Scan to Register
            </span>
          </div>

          {/* Quick Channels */}
          <div className="space-y-3">
            <Button
              onClick={handleShareWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 py-3 rounded-2xl h-auto w-full border-none"
            >
              <MessageCircle size={16} />
              WhatsApp Share
            </Button>
            <Button
              onClick={handleShareEmail}
              variant="outline"
              className="border-primary/10 text-primary hover:bg-primary/5 font-bold gap-2 py-3 rounded-2xl h-auto w-full"
            >
              <Mail size={16} />
              Email Invitation
            </Button>
            <div className="p-3 bg-primary/5 border border-primary/10 rounded-2xl text-[10px] font-semibold text-primary text-center">
              Referral Code: <span className="font-mono font-bold select-all">{referralCode}</span>
            </div>
          </div>
        </div>

        {/* Social Sharing Preview Card */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-text-muted block flex items-center gap-1">
            <Sparkles size={12} className="text-primary" />
            Social Sharing Card Preview
          </label>
          <div className="p-4 bg-bg border border-border rounded-3xl relative overflow-hidden space-y-2">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-[#0e786b]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary leading-none block">
              GlobalSmart Foundation
            </span>
            <h4 className="font-display font-black text-sm text-text leading-tight mt-1.5">
              Let's shape our districts together. Register as a Smart Citizen!
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
              I just joined the active civic movement. Get verified to support clean water and education drives in your district.
            </p>
            <div className="flex justify-between items-center pt-2.5 border-t border-border/80 text-[10px] text-text-muted font-bold font-mono">
              <span>gscf.org/register</span>
              <span className="text-primary">CODE: {referralCode}</span>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
