"use client";

import { useEffect, useState } from "react";
import { useAlert } from "@/components/ui/AlertProvider";
import { Spinner } from "@/components/ui/spinner";
import {
  useCitizenStore,
  selectReferralCode,
  selectReferralLink,
} from "@/store/citizenStore";


// Widgets
import WelcomeHero from "./WelcomeHero";
import MemberCard from "./MemberCard";
import StatsGrid from "./StatsGrid";
import QuickActions from "./QuickActions";
import UpcomingEvents from "./UpcomingEvents";
import ShareReferralDialog from "./ShareReferralDialog";

export function CitizenDashboard() {
  const { showAlert } = useAlert();
  const { user, loading: storeLoading, fetchProfile } = useCitizenStore();
  const referralCode = useCitizenStore(selectReferralCode);
  const referralLink = useCitizenStore(selectReferralLink);

  const [localLoading, setLocalLoading] = useState(true);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      // Ensure profile is loaded in store
      await fetchProfile();
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
  const dbStats = user
    ? {
        total_amount: user.total_amount,
        total_referrals: user.total_referrals,
        events_attended: user.total_events_registered || 0,
      }
    : null;

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      {/* Main Grid: Left Column for Actions/Stats, Right Column for Info/Status widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Left Column (Main Panel) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-text">
              Overview Metrics
            </h3>
            <StatsGrid stats={dbStats} />
          </div>

          <QuickActions onInviteClick={() => setIsShareOpen(true)} />
        </div>

        {/* Right Column (Sidebar Panels) */}
        <div className="h-full">
          <MemberCard profile={user} />
        </div>
      </div>

      {/* Upcoming Events Section */}
      <UpcomingEvents />

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
