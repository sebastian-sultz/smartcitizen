"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCitizenStore,
  selectReferralCode,
  selectReferralLink,
} from "@/store/citizenStore";
import { getReferredMembers } from "../api";
import { UserResponse } from "@/features/shared/auth/types";

import ReferralStats from "./ReferralStats";
import ShareReferral from "./ShareReferral";
import ReferralProgress from "./ReferralProgress";
import ReferredMembersTable from "./ReferredMembersTable";

export default function ReferralDashboard() {
  const {
    user,
    loading: storeLoading,
    fetchProfile,
    refreshProfile,
  } = useCitizenStore();
  const referralCode = useCitizenStore(selectReferralCode);
  const referralLink = useCitizenStore(selectReferralLink);

  const [members, setMembers] = useState<UserResponse[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const loadReferrals = async (showLoading = true) => {
    if (!user?.id) return;
    try {
      if (showLoading) setLocalLoading(true);
      const membersData = await getReferredMembers(user.id);
      setMembers(membersData || []);
    } catch (err) {
      console.error("Failed to load referral details:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getReferredMembers(user.id)
        .then((membersData) => {
          setMembers(membersData || []);
          setLocalLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load referral details:", err);
          setLocalLoading(false);
        });
    }
  }, [user]);

  const handleMemberAdded = async () => {
    await refreshProfile();
    await loadReferrals(true);
  };

  const isLoading = storeLoading || (user?.id ? localLoading : false);

  if (isLoading) {
    return (
      <div className="space-y-8 w-full animate-pulse">
        {/* Referral Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-28 w-full rounded-card" />
          <Skeleton className="h-28 w-full rounded-card" />
          <Skeleton className="h-28 w-full rounded-card" />
        </div>

        {/* Share and Progress Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Skeleton className="h-64 w-full rounded-card" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full rounded-card" />
          </div>
        </div>

        {/* Table Directory Placeholder */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top statistics cards */}
      <ReferralStats user={user} />

      {/* Sharing Control Panel & Progress side-by-side (3:2 ratio on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        <div className="lg:col-span-3">
          <ShareReferral
            user={user}
            referralLink={referralLink}
            onMemberAdded={handleMemberAdded}
          />
        </div>
        <div className="lg:col-span-2">
          <ReferralProgress user={user} />
        </div>
      </div>

      {/* Full-width Network Directory */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-text">
          Referred Network Directory
        </h3>
        <ReferredMembersTable members={members} />
      </div>
    </div>
  );
}
