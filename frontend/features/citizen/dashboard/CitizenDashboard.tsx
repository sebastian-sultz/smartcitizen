"use client";

import { useEffect, useState } from "react";
import { useAlert } from "@/components/ui/AlertProvider";
import { Skeleton } from "@/components/ui/skeleton";
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
        overall_referrals: user.overall_referrals || 0,
        overall_network_donation: user.overall_network_donation || 0,
      }
    : null;

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (storeLoading || localLoading) {
    return (
      <div className="space-y-8 w-full animate-pulse">
        {/* Welcome Hero Skeleton */}
        <Skeleton className="h-44 w-full rounded-card" />

        {/* Main Grid: Left Column for Actions/Stats, Right Column for Info/Status widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Left Column (Main Panel) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <div className="flex sm:grid sm:grid-cols-3 gap-6 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <Skeleton className="h-28 w-[82%] sm:w-full shrink-0 rounded-card" />
                <Skeleton className="h-28 w-[82%] sm:w-full shrink-0 rounded-card" />
                <Skeleton className="h-28 w-[82%] sm:w-full shrink-0 rounded-card" />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32 rounded-lg" />
              {/* Mobile skeleton */}
              <div className="grid grid-cols-3 gap-4 sm:hidden">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
              {/* Desktop skeleton */}
              <div className="hidden sm:grid sm:grid-cols-4 gap-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar Panels) */}
          <div className="h-full">
            <Skeleton className="h-[380px] w-full rounded-card" />
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
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
