"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, Heart, ArrowUpRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

import { getSystemStats, SystemStatsResponse } from "@/features/shared/auth";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardOverview() {
  const [statsData, setStatsData] = useState<SystemStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await getSystemStats();
        if (res) {
          setStatsData(res);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-text">Dashboard Overview</h2>
          <p className="text-text-muted">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-surface p-6 rounded-2xl shadow-card border border-border space-y-4"
            >
              <div className="flex justify-between items-start">
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-16 h-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Smart Citizens",
      value: (statsData?.total_users ?? 0).toString(),
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Total Referrals",
      value: (statsData?.total_referrals ?? 0).toString(),
      icon: <UserCheck className="w-6 h-6" />,
      color: "bg-teal-600",
    },
    {
      title: "Total Amount Donated",
      value: `₹ ${(statsData?.total_amount ?? 0).toLocaleString("en-IN")}`,
      icon: <Heart className="w-6 h-6" />,
      color: "bg-accent",
    },
    {
      title: "Total Payments",
      value: (statsData?.total_payments ?? 0).toString(),
      icon: <Activity className="w-6 h-6" />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text">Dashboard Overview</h2>
        <p className="text-text-muted">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="animate-fade-in-up bg-surface p-6 rounded-2xl shadow-card border border-border relative overflow-hidden group"
          >
            <div
              className={cn(
                "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-125",
                stat.color,
              )}
            />

            <div className="flex justify-between items-start mb-4">
              <div
                className={cn(
                  "p-3 rounded-xl text-white shadow-lg",
                  stat.color,
                )}
              >
                {stat.icon}
              </div>
            </div>

            <h3 className="text-text-muted text-sm font-medium">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
