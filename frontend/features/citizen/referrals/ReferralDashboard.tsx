"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getReferralStats, getReferredMembers } from "../api";
import { ReferralStats as ReferralStatsType, ReferralMember } from "../types";

import ReferralStats from "./ReferralStats";
import ShareReferral from "./ShareReferral";
import ReferralProgress from "./ReferralProgress";
import ReferredMembersTable from "./ReferredMembersTable";

export default function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStatsType | null>(null);
  const [members, setMembers] = useState<ReferralMember[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      const [statsData, membersData] = await Promise.all([
        getReferralStats(),
        getReferredMembers()
      ]);
      setStats(statsData);
      setMembers(membersData);
    } catch (err) {
      console.error("Failed to load referral details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferralData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top statistics cards */}
      <ReferralStats stats={stats} />

      {/* Main Grid: Left Column for Sharing & Table, Right Column for Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <ShareReferral stats={stats} />
          
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-text">Referred Network Directory</h3>
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
