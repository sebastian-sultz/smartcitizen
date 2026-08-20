"use client";

import { useState } from "react";
import { UserResponse } from "@/features/shared/auth/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QRCodeSVG } from "qrcode.react";
import {
  Share2,
  Copy,
  Send,
  Mail,
  QrCode,
  Check,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import AddMemberDialog from "./AddMemberDialog";

interface ShareReferralProps {
  user: UserResponse | null;
  referralLink: string;
  onMemberAdded?: () => void;
}

export default function ShareReferral({
  user,
  referralLink,
  onMemberAdded,
}: ShareReferralProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!user) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success("Referral link copied.");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Join me at the GlobalSmart Citizens Foundation! Sign up using my referral link: ${referralLink}`;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  const handleEmailShare = () => {
    const subject = "Join GlobalSmart Citizens Foundation";
    const body = `Hi,\n\nI invite you to join the GlobalSmart Citizens Foundation.\n\nSign up using my link: ${referralLink}\n\nBest,`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  return (
    <>
      <Card shape="lg" className="flex flex-col justify-between h-full">
        <div>
          <CardHeader>
            <CardTitle size="default" className="flex items-center gap-2">
              <Share2 size={20} className="text-primary" />
              Sharing Hub & Direct Enrollment
            </CardTitle>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              Invite friends using your custom referral link, QR code, or enroll
              them directly into your network.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Referral URL Copy Input */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-muted">
                Invitation Link
              </span>
              <div className="flex gap-2">
                <div className="flex-1 bg-bg px-4 py-3 rounded-xl border border-border text-sm font-mono text-text-muted truncate select-all leading-relaxed">
                  {referralLink}
                </div>
                <Button
                  onClick={handleCopyLink}
                  variant="ghost-primary"
                  size="sm"
                  className="shrink-0"
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

              {/* Social Share Column & Direct Enrollment */}
              <div className="flex flex-col justify-center space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                    Direct Actions
                  </span>
                  <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed font-medium">
                    Distribute link or add member by name & phone.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    variant="primary"
                    size="sm"
                    fullWidth
                    startIcon={<UserPlus size={13} />}
                  >
                    Direct Member Enrollment
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={handleWhatsAppShare}
                      variant="success"
                      size="sm"
                      fullWidth
                    >
                      <Send size={13} />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={handleEmailShare}
                      variant="secondary"
                      size="sm"
                      fullWidth
                    >
                      <Mail size={13} />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <AddMemberDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        referralCode={user.member_id}
        onSuccess={onMemberAdded}
      />
    </>
  );
}
