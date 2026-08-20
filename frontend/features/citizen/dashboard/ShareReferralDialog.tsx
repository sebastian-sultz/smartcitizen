"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      "_blank",
    );
  };

  const handleEmailShare = () => {
    const subject = "Invitation to Join GlobalSmart Citizens Foundation";
    const body = `Hi,\n\nI invite you to join me in supporting the GlobalSmart Citizens Foundation. Let's work together for clean environment, education, and legal rights.\n\nSign up using my link: ${referralLink}\n\nBest,`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 size={20} className="text-primary" />
            Invite Your Friends
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4 min-w-0">
          <p className="text-sm text-text-muted leading-relaxed font-medium break-normal whitespace-normal">
            Share your custom referral code or link with friends. When they
            register and make a donation, you progress toward unlocking
            volunteer status.
          </p>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Your Referral Code
            </span>
            <div className="py-3 px-5 bg-bg border border-border rounded-2xl font-mono text-center font-bold text-primary text-xl">
              {referralCode}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Invitation Link
            </span>
            <div className="flex gap-2 items-stretch w-full min-w-0">
              <div className="flex-1 bg-bg px-4 py-3 rounded-xl border border-border text-sm font-mono text-text-muted overflow-hidden flex items-center min-w-0">
                <span className="truncate w-full">{referralLink}</span>
              </div>
              <Button
                onClick={handleCopyLink}
                variant="ghost-primary"
                size="sm"
                className="shrink-0 border border-border"
                title="Copy Link"
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div className="w-full border-t border-border" />

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWhatsAppShare}
              variant="success"
              fullWidth
              startIcon={<Send size={15} />}
            >
              WhatsApp
            </Button>
            <Button
              onClick={handleEmailShare}
              variant="secondary"
              fullWidth
              startIcon={<Mail size={15} />}
            >
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
