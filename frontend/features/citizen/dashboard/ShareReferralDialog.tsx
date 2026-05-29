"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Share2, Copy, Send, Mail } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";

interface ShareReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referralCode: string;
  referralLink: string;
}

export default function ShareReferralDialog({
  open,
  onOpenChange,
  referralCode,
  referralLink,
}: ShareReferralDialogProps) {
  const { showAlert } = useAlert();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    showAlert({
      title: "Copied!",
      message: "Referral URL copied to clipboard.",
      type: "success",
    });
  };

  const handleWhatsAppShare = () => {
    const text = `Join me at the GlobalSmart Citizens Foundation! Sign up using my referral link and let's work together to empower communities: ${referralLink}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleEmailShare = () => {
    const subject = "Invitation to Join GlobalSmart Citizens Foundation";
    const body = `Hi,\n\nI invite you to join me in supporting the GlobalSmart Citizens Foundation. Let's work together for clean environment, education, and legal rights.\n\nSign up using my link: ${referralLink}\n\nBest,`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[32px] p-6">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl text-text flex items-center gap-2">
            <Share2 size={20} className="text-primary" />
            Invite Your Friends
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <p className="text-sm text-text-muted leading-relaxed font-medium">
            Share your custom referral code or link with friends. When they
            register and make a donation, you progress toward unlocking
            volunteer status.
          </p>

          <div className="space-y-2">
            <span className="text-xs font-bold text-text-muted">
              Your Referral Code
            </span>
            <div className="p-3 bg-bg border border-border rounded-2xl font-mono text-center font-bold text-primary tracking-widest text-lg">
              {referralCode}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-text-muted">
              Invitation Link
            </span>
            <div className="flex gap-2">
              <div className="flex-1 bg-bg p-3 rounded-2xl border border-border text-sm font-mono text-text-muted truncate">
                {referralLink}
              </div>
              <Button
                onClick={handleCopyLink}
                variant="secondary"
                className="bg-primary/10 text-primary border-none hover:bg-primary/20 p-3 h-auto rounded-2xl shrink-0"
                title="Copy link"
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div className="w-full border-t border-border" />

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWhatsAppShare}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 py-3 rounded-2xl border-none"
            >
              <Send size={15} />
              WhatsApp
            </Button>
            <Button
              onClick={handleEmailShare}
              variant="outline"
              className="border-border hover:bg-bg text-text font-bold gap-2 py-3 rounded-2xl"
            >
              <Mail size={15} />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
