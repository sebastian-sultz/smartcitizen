"use client";

import { useEffect, useState } from "react";
import { useAlert } from "@/components/ui/AlertProvider";
import { getProfile } from "@/features/shared/auth/api";
import { UserResponse } from "@/features/shared/auth/types";
import { Spinner } from "@/components/ui/spinner";
import { 
  getDashboardStats, 
  getActivityTimeline, 
  getReferralStats, 
  getDonationStats 
} from "../api";
import { DashboardStats, ActivityItem, ReferralStats, DonationStats } from "../types";

// Widgets
import WelcomeHero from "./WelcomeHero";
import MemberCard from "./MemberCard";
import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import UpcomingEvents from "./UpcomingEvents";
import ReferralSummaryWidget from "./ReferralSummaryWidget";
import DonationSummaryWidget from "./DonationSummaryWidget";

// Modal & Share Imports
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Share2, Copy, Send, Mail } from "lucide-react";

export function CitizenDashboard() {
  const { showAlert } = useAlert();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [dbStats, setDbStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [refStats, setRefStats] = useState<ReferralStats | null>(null);
  const [donStats, setDonStats] = useState<DonationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [u, stats, timeline, referrals, donations] = await Promise.all([
        getProfile(),
        getDashboardStats(),
        getActivityTimeline(),
        getReferralStats(),
        getDonationStats(),
      ]);

      if (u) setProfile(u);
      setDbStats(stats);
      setActivities(timeline);
      setRefStats(referrals);
      setDonStats(donations);
    } catch (err) {
      console.error("Failed to load dashboard dataset:", err);
      showAlert({
        title: "Load Failure",
        message: "Unable to retrieve dashboard metrics. Please refresh the page.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCopyLink = () => {
    const refCode = profile?.referral_id || `GSC-${profile?.id?.substring(0, 6).toUpperCase()}`;
    const referralLink = `https://gscf.org/join?ref=${refCode}`;
    navigator.clipboard.writeText(referralLink);
    showAlert({
      title: "Copied!",
      message: "Referral URL copied to clipboard.",
      type: "success",
    });
  };

  const handleWhatsAppShare = () => {
    const refCode = profile?.referral_id || `GSC-${profile?.id?.substring(0, 6).toUpperCase()}`;
    const text = `Join me at the GlobalSmart Citizens Foundation! Sign up using my referral link and let's work together to empower communities: https://gscf.org/join?ref=${refCode}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleEmailShare = () => {
    const refCode = profile?.referral_id || `GSC-${profile?.id?.substring(0, 6).toUpperCase()}`;
    const subject = "Invitation to Join GlobalSmart Citizens Foundation";
    const body = `Hi,\n\nI invite you to join me in supporting the GlobalSmart Citizens Foundation. Let's work together for clean environment, education, and legal rights.\n\nSign up using my link: https://gscf.org/join?ref=${refCode}\n\nBest,`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  const refCode = profile?.referral_id || `GSC-${profile?.id?.substring(0, 6).toUpperCase()}`;
  const referralLink = `https://gscf.org/join?ref=${refCode}`;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeHero profile={profile} onInviteClick={() => setIsShareOpen(true)} />

      {/* Main Grid: Left Column for Actions/Timeline/Stats, Right Column for Info/Status widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Panel) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-text">Overview Metrics</h3>
            <StatsGrid stats={dbStats} />
          </div>

          <QuickActions onInviteClick={() => setIsShareOpen(true)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentActivity activities={activities} />
            <UpcomingEvents />
          </div>

        </div>

        {/* Right Column (Sidebar Panels) */}
        <div className="space-y-8">
          <MemberCard profile={profile} />
          
          <ReferralSummaryWidget stats={refStats} onInviteClick={() => setIsShareOpen(true)} />
          
          <DonationSummaryWidget stats={donStats} />
        </div>

      </div>

      {/* Share / Invite Friends Modal */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="max-w-md rounded-[32px] p-6">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-xl text-text flex items-center gap-2">
              <Share2 size={20} className="text-primary" />
              Invite Your Friends
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            <p className="text-sm text-text-muted leading-relaxed font-medium">
              Share your custom referral code or link with friends. When they register and make a donation, you progress toward unlocking volunteer status.
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-text-muted">Your Referral Code</span>
              <div className="p-3 bg-bg border border-border rounded-2xl font-mono text-center font-bold text-primary tracking-widest text-lg">
                {refCode}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-text-muted">Invitation Link</span>
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
    </div>
  );
}
