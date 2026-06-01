"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  useCitizenStore,
  selectReferralCode,
  selectReferralLink,
} from "@/store/citizenStore";
import { getReferredMembers } from "../api";
import { ReferralMember } from "../types";

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

  return (
    <div className="space-y-8">
      {/* Top statistics cards */}
      <ReferralStats user={user} />

      {/* Sharing Control Panel & Progress side-by-side (3:2 ratio on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        <div className="lg:col-span-3">
          <ShareReferral user={user} referralLink={referralLink} />
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
