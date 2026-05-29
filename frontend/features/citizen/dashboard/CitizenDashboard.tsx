"use client";

import { useEffect, useState } from "react";
import { useAlert } from "@/components/ui/AlertProvider";
import { Spinner } from "@/components/ui/spinner";
import {
  useCitizenStore,
  selectReferralCode,
  selectReferralLink,
  selectIsVolunteer,
} from "@/store/citizenStore";
import { getActivityTimeline, getDonationStats } from "../api";
import {
  DashboardStats,
  ActivityItem,
  ReferralStats,
  DonationStats,
} from "../types";

// Widgets
import WelcomeHero from "./WelcomeHero";
import MemberCard from "./MemberCard";
import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import UpcomingEvents from "./UpcomingEvents";
import ReferralSummaryWidget from "./ReferralSummaryWidget";
import DonationSummaryWidget from "./DonationSummaryWidget";
import ShareReferralDialog from "./ShareReferralDialog";

export function CitizenDashboard() {
  const { showAlert } = useAlert();
  const { user, loading: storeLoading, fetchProfile } = useCitizenStore();
  const isVolunteer = useCitizenStore(selectIsVolunteer);
  const referralCode = useCitizenStore(selectReferralCode);
  const referralLink = useCitizenStore(selectReferralLink);

  const [dbStats, setDbStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [refStats, setRefStats] = useState<ReferralStats | null>(null);
  const [donStats, setDonStats] = useState<DonationStats | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLocalLoading(true);

      // Ensure profile is loaded in store
      await fetchProfile();

      const [timeline, donations] = await Promise.all([
        getActivityTimeline(),
        getDonationStats(),
      ]);

      setActivities(timeline);
      setDonStats(donations);
    } catch (err) {
      console.error("Failed to load dashboard dataset:", err);
      showAlert({
        title: "Load Failure",
        message:
          "Unable to retrieve dashboard metrics. Please refresh the page.",
        type: "error",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  // Compute derived dashboard stats when store data is available
  useEffect(() => {
    if (!user) return;

    setDbStats({
      total_amount: user.total_amount,
      total_referrals: user.total_referrals,
      campaigns_joined: 3, // TODO: Replace with real API data when backend supports campaigns
      badge_level:
        user.total_amount > 5000
          ? "Gold"
          : user.total_amount > 2000
            ? "Silver"
            : "Bronze",
      events_attended: 2, // TODO: Replace with real API data when backend supports event attendance
      volunteer_status: isVolunteer ? "approved" : "not_applied",
    });

    setRefStats({
      total_referrals: user.total_referrals,
      referral_payment_count: user.referral_payment_count,
      total_contribution_generated: user.referral_payment_count * 100,
      referral_code: referralCode,
      referral_link: referralLink,
    });
  }, [user, isVolunteer, referralCode, referralLink]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (storeLoading || localLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeHero
        profile={user}
        onInviteClick={() => setIsShareOpen(true)}
      />

      {/* Main Grid: Left Column for Actions/Timeline/Stats, Right Column for Info/Status widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Panel) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-text">
              Overview Metrics
            </h3>
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
          <MemberCard profile={user} />

          <ReferralSummaryWidget
            stats={refStats}
            onInviteClick={() => setIsShareOpen(true)}
          />

          <DonationSummaryWidget stats={donStats} />
        </div>
      </div>

      {/* Share / Invite Friends Modal */}
      <ShareReferralDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        referralCode={referralCode}
        referralLink={referralLink}
      />
    </div>
  );
}
