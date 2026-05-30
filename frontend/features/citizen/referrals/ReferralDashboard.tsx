"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  useCitizenStore,
  selectReferralCode,
  selectReferralLink,
} from "@/store/citizenStore";
import { getReferredMembers } from "../api";
import { ReferralStats as ReferralStatsType, ReferralMember } from "../types";

import ReferralStats from "./ReferralStats";
import ShareReferral from "./ShareReferral";
import ReferralProgress from "./ReferralProgress";
import ReferredMembersTable from "./ReferredMembersTable";

export default function ReferralDashboard() {
  const { user, loading: storeLoading, fetchProfile } = useCitizenStore();
  const referralCode = useCitizenStore(selectReferralCode);
  const referralLink = useCitizenStore(selectReferralLink);

  const [members, setMembers] = useState<ReferralMember[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  const loadReferralData = async () => {
    try {
      setLocalLoading(true);
      await fetchProfile();
      const membersData = await getReferredMembers();
      setMembers(membersData);
    } catch (err) {
      console.error("Failed to load referral details:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadReferralData();
  }, []);

  if (storeLoading || localLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  // Compute referral stats from store data
  const stats: ReferralStatsType | null = user
    ? {
        total_referrals: user.total_referrals,
        referral_payment_count: user.referral_payment_count,
        total_contribution_generated: user.referral_payment_count * 100,
        referral_code: referralCode,
        referral_link: referralLink,
      }
    : null;

  return (
    <div className="space-y-8">
      {/* Top statistics cards */}
      <ReferralStats stats={stats} />

      {/* Main Grid: Left Column for Sharing & Table, Right Column for Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ShareReferral stats={stats} />

          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-text">
              Referred Network Directory
            </h3>
            <ReferredMembersTable members={members} />
          </div>
        </div>

        <div className="space-y-8">
          <ReferralProgress stats={stats} />
        </div>
      </div>
    </div>
  );
}
