"use client";

import React, { useState, useEffect } from "react";
import { getUserNetworkStats } from "../../api";
import { UserNetworkStats } from "../../types";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GitCommit, Heart, GitFork } from "lucide-react";
import { toast } from "sonner";

interface UserNetworkStatsTabProps {
  userId: string;
}

export const UserNetworkStatsTab = ({ userId }: UserNetworkStatsTabProps) => {
  const [stats, setStats] = useState<UserNetworkStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await getUserNetworkStats(userId);
        if (res) {
          setStats(res);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-text-muted">
        Failed to compute network metrics.
      </div>
    );
  }

  const metrics = [
    {
      icon: Users,
      label: "Direct Referrals",
      value: `${stats.directReferralsCount} referred`,
      colorClass: "bg-primary/10 text-primary",
    },
    {
      icon: GitCommit,
      label: "Total Referred Network",
      value: `${stats.totalDownlineCount} total members`,
      colorClass: "bg-accent/10 text-accent",
    },
    {
      icon: Heart,
      label: "Direct Referral Donations",
      value: `₹${stats.directReferralDonationAmount.toLocaleString("en-IN")}`,
      colorClass: "bg-success-bg text-success",
    },
    {
      icon: GitFork,
      label: "Total Network Fundraising",
      value: `₹${stats.totalNetworkDonationAmount.toLocaleString("en-IN")}`,
      colorClass: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-bg/40">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl shrink-0 ${metric.colorClass}`}>
              <metric.icon size={22} />
            </div>
            <div>
              <span className="text-xs font-semibold text-text-muted block">
                {metric.label}
              </span>
              <span className="text-xl font-bold text-text">
                {metric.value}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
