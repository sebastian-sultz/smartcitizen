"use client";

import { useEffect, useState } from "react";
import { UserResponse } from "@/features/auth/types";
import { getProfile } from "@/features/auth/api";
import { Spinner } from "@/components/ui/spinner";
import { useAlert } from "@/components/ui/AlertProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Share2, Copy, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Import dashboard widgets
import WelcomeHero from "./dashboard/WelcomeHero";
import MemberCard from "./dashboard/MemberCard";
import StatsGrid from "./dashboard/StatsGrid";
import QuickActions from "./dashboard/QuickActions";
import RecentActivity from "./dashboard/RecentActivity";
import UpcomingEvents from "./dashboard/UpcomingEvents";
import ReferralSummaryWidget from "./dashboard/ReferralSummaryWidget";
import DonationSummaryWidget from "./dashboard/DonationSummaryWidget";

// Import types & APIs
import { DashboardStats, ActivityItem, ReferralStats, DonationStats, DonationRecord } from "../types";
import { 
  getDashboardStats, 
  getActivityTimeline, 
  getReferralStats, 
  getDonationStats, 
  getDonationHistory 
} from "../api";

export const CitizenDashboard = () => {
  const { showAlert } = useAlert();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [activityTimeline, setActivityTimeline] = useState<ActivityItem[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [donationStats, setDonationStats] = useState<DonationStats | null>(null);
  const [recentDonations, setRecentDonations] = useState<DonationRecord[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    const loadAllDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch baseline user profile (real endpoint)
        const userProfile = await getProfile();
        setProfile(userProfile);

        // Fetch dashboard stats, timeline, and widget details (mock APIs)
        const [stats, timeline, refStats, donStats, donations] = await Promise.all([
          getDashboardStats(),
          getActivityTimeline(),
          getReferralStats(),
          getDonationStats(),
          getDonationHistory(),
        ]);

        setDashboardStats(stats);
        setActivityTimeline(timeline);
        setReferralStats(refStats);
        setDonationStats(donStats);
        setRecentDonations(donations);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllDashboardData();
  }, []);

  const handleCopyLink = () => {
    const refLink = referralStats?.referralLink || `https://smartcitizen.org/signup?ref=SC-${profile?.id?.substring(0, 6).toUpperCase()}`;
    navigator.clipboard.writeText(refLink);
    showAlert({
      title: "Link Copied",
      message: "Your unique invitation link has been copied to your clipboard!",
      type: "success",
    });
  };

  const handleShareWhatsApp = () => {
    const refLink = referralStats?.referralLink || `https://smartcitizen.org/signup?ref=SC-${profile?.id?.substring(0, 6).toUpperCase()}`;
    const text = encodeURIComponent(`Hey! I joined the Global Smart Citizen Foundation to support local community drives. Register using my link to join the movement: ${refLink}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareEmail = () => {
    const refLink = referralStats?.referralLink || `https://smartcitizen.org/signup?ref=SC-${profile?.id?.substring(0, 6).toUpperCase()}`;
    const subject = encodeURIComponent("Join me at Global Smart Citizen Foundation");
    const body = encodeURIComponent(`Hi,\n\nI recently joined the Global Smart Citizen Foundation as a member to support Clean Water, Plantation, and Education drives. I'd love for you to join as well. Use my unique registration link to get active:\n\n${refLink}\n\nCheers!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <Spinner className="size-10 text-primary animate-spin" />
        <p className="text-text-muted font-bold text-xs uppercase tracking-wider">Loading Citizen Portal...</p>
      </div>
    );
  }

  const referralLink = referralStats?.referralLink || `https://smartcitizen.org/signup?ref=SC-${profile?.id?.substring(0, 6).toUpperCase()}`;

  return (
    <div className="space-y-8">
      
      {/* Top Banner and Member Card Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <WelcomeHero profile={profile} onInviteClick={() => setIsInviteOpen(true)} />
        </div>
        <div className="lg:col-span-1">
          <MemberCard profile={profile} />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <StatsGrid stats={dashboardStats} />

      {/* Activities and Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={activityTimeline} />
        <UpcomingEvents />
      </div>

      {/* Double Column Row: Detailed Widgets + Action Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Quick Actions (large) */}
        <div className="lg:col-span-2">
          <QuickActions onInviteClick={() => setIsInviteOpen(true)} />
        </div>
        
        {/* Right column: Summary Widgets */}
        <div className="lg:col-span-1 space-y-6">
          <ReferralSummaryWidget stats={referralStats} onInviteClick={() => setIsInviteOpen(true)} />
          <DonationSummaryWidget stats={donationStats} recentDonations={recentDonations} />
        </div>
      </div>

      {/* Invite Friends Modal Dialog */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md rounded-[32px] p-6 text-center">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl text-text flex items-center justify-center gap-2">
              <Share2 className="text-primary" size={22} />
              Spread the Word
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6 flex flex-col items-center">
            <p className="text-sm text-text-muted font-medium px-2 leading-relaxed">
              Invite your friends and neighbors to register. Once they join, you move closer to volunteer eligibility and special project roles!
            </p>

            {/* QR Code */}
            <div className="p-4 bg-white border border-border rounded-3xl shadow-sm">
              <QRCodeSVG 
                value={referralLink} 
                size={140} 
                level="M" 
                includeMargin={true}
                fgColor="#0A5C52"
              />
            </div>

            {/* Link Copy Row */}
            <div className="w-full flex gap-2">
              <div className="flex-1 bg-bg p-3.5 rounded-2xl border border-border text-xs font-mono text-text-muted truncate select-all text-left">
                {referralLink}
              </div>
              <Button 
                onClick={handleCopyLink}
                className="bg-primary hover:bg-primary/95 text-white font-bold px-4 rounded-2xl h-auto"
                aria-label="Copy invitation link"
              >
                <Copy size={16} />
              </Button>
            </div>

            {/* Sharing Row */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                onClick={handleShareWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 py-3 rounded-2xl h-auto border-none"
              >
                <MessageCircle size={16} />
                WhatsApp
              </Button>
              <Button
                onClick={handleShareEmail}
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/5 font-bold gap-2 py-3 rounded-2xl h-auto"
              >
                <Mail size={16} />
                Email invite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};
