"use client";

import { useEffect, useState } from "react";
import { getReferralStats, getReferredMembers } from "../../api";
import { ReferralStats as ReferralStatsType, ReferralMember } from "../../types";
import { Spinner } from "@/components/ui/spinner";
import ReferralStats from "./ReferralStats";
import ShareReferral from "./ShareReferral";
import ReferredMembersTable from "./ReferredMembersTable";
import ReferralProgress from "./ReferralProgress";

export default function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStatsType | null>(null);
  const [members, setMembers] = useState<ReferralMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [filters, setFilters] = useState({ search: "", status: "all" });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getReferralStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load referral dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadReferredMembers = async (search: string, status: string) => {
    try {
      setTableLoading(true);
      const list = await getReferredMembers({ search, status });
      setMembers(list);
    } catch (err) {
      console.error("Failed to load referred members:", err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadReferredMembers(filters.search, filters.status);
  }, [filters]);

  const handleFilterChange = (newFilters: { search: string; status: string }) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <Spinner className="size-10 text-primary animate-spin" />
        <p className="text-text-muted font-bold text-xs uppercase tracking-wider">Loading referral engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* KPI stats display */}
      <ReferralStats stats={stats} />

      {/* Share Actions and Progress timeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <ShareReferral 
            referralCode={stats?.referralCode || "SC-MEMBER"} 
            referralLink={stats?.referralLink || "https://smartcitizen.org/signup"} 
          />
        </div>
        <div className="lg:col-span-1">
          <ReferralProgress joinedCount={stats?.joinedCount || 0} />
        </div>
      </div>

      {/* Referred Members connection table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-text">Referred Network Directory</h3>
          <span className="text-xs text-text-muted font-bold">{members.length} Connections Found</span>
        </div>
        
        <ReferredMembersTable 
          members={members} 
          loading={tableLoading} 
          onFilterChange={handleFilterChange} 
        />
      </div>

    </div>
  );
}
