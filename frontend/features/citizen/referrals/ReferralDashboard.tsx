"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
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

  const loadReferrals = async () => {
    if (!user?.id) return;
    try {
      setLocalLoading(true);
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
      loadReferrals();
    } else if (!storeLoading) {
      setLocalLoading(false);
    }
  }, [user, storeLoading]);

  const handleMemberAdded = async () => {
    await refreshProfile();
    await loadReferrals();
  };

  if (storeLoading || localLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
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
