"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, Heart, Activity, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import { getSystemStats, SystemStatsResponse } from "@/features/shared/auth";
import { getAdminAnalytics, syncPendingReceipts } from "@/features/admin/api";
import { AdminAnalyticsResponse } from "@/features/admin/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export function DashboardOverview() {
  const [statsData, setStatsData] = useState<SystemStatsResponse | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncReceipts = async () => {
    try {
      setIsSyncing(true);
      toast.info("Generating and compiling all pending PDF receipts...");
      const res = await syncPendingReceipts();
      toast.success(`Successfully generated and compiled ${res.count} pending receipt(s)!`);
      
      // Re-fetch analytics data to refresh pendingCount warning
      const updatedAnalytics = await getAdminAnalytics();
      if (updatedAnalytics) {
        setAnalyticsData(updatedAnalytics);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to synchronize pending receipts.");
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, analyticsRes] = await Promise.all([
          getSystemStats(),
          getAdminAnalytics(),
        ]);
        if (statsRes) setStatsData(statsRes);
        if (analyticsRes) setAnalyticsData(analyticsRes);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Dynamically compute the last 12 months to fill missing months with 0
  const last12Months = React.useMemo(() => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      months.push(`${year}-${month}`);
    }
    return months;
  }, []);

  const donationData = React.useMemo(() => {
    return last12Months.map((m) => {
      const match = analyticsData?.donationGrowth?.find((d) => d.month === m);
      const dateObj = new Date(m + "-02"); // Add day to avoid timezone shifts
      const formattedMonth = dateObj.toLocaleString("en-US", { month: "short" });
      return {
        month: formattedMonth,
        total: match ? match.total : 0,
      };
    });
  }, [analyticsData, last12Months]);

  const registrationData = React.useMemo(() => {
    return last12Months.map((m) => {
      const match = analyticsData?.registrationGrowth?.find((r) => r.month === m);
      const dateObj = new Date(m + "-02");
      const formattedMonth = dateObj.toLocaleString("en-US", { month: "short" });
      return {
        month: formattedMonth,
        count: match ? match.count : 0,
      };
    });
  }, [analyticsData, last12Months]);

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

        {/* Charts Grid Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface p-6 rounded-2xl shadow-card border border-border h-72 flex flex-col justify-between">
            <div className="space-y-2">
              <Skeleton className="w-40 h-6" />
              <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="w-full h-48" />
          </div>
          <div className="bg-surface p-6 rounded-2xl shadow-card border border-border h-72 flex flex-col justify-between">
            <div className="space-y-2">
              <Skeleton className="w-40 h-6" />
              <Skeleton className="w-24 h-4" />
            </div>
            <Skeleton className="w-full h-48" />
          </div>
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



  // SVG Chart layout definitions
  const maxDonation = donationData.length > 0 ? Math.max(...donationData.map(d => d.total), 1) : 1;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;
  const svgWidth = 600;
  const svgHeight = 240;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const linePath = donationData.map((d, i) => {
    const x = paddingLeft + (i / Math.max(1, donationData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.total / maxDonation) * chartHeight;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const areaPath = donationData.length > 0 ? `
    ${linePath}
    L ${paddingLeft + chartWidth} ${paddingTop + chartHeight}
    L ${paddingLeft} ${paddingTop + chartHeight}
    Z
  ` : "";

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = paddingTop + chartHeight - ratio * chartHeight;
    const val = Math.round(ratio * maxDonation);
    return { y, val };
  });

  const maxReg = registrationData.length > 0 ? Math.max(...registrationData.map(r => r.count), 1) : 1;
  const regGridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = paddingTop + chartHeight - ratio * chartHeight;
    const val = Math.round(ratio * maxReg);
    return { y, val };
  });

  const volunteerActivity = analyticsData?.volunteerActivity || [];
  const activeVolunteers = volunteerActivity.filter(v => v.status?.toUpperCase() === "APPROVED").reduce((acc, v) => acc + v.count, 0);
  const pendingVolunteers = volunteerActivity.filter(v => v.status?.toUpperCase() === "PENDING").reduce((acc, v) => acc + v.count, 0);
  const suspendedVolunteers = volunteerActivity.filter(v => v.status?.toUpperCase() === "SUSPENDED").reduce((acc, v) => acc + v.count, 0);
  const rejectedVolunteers = volunteerActivity.filter(v => v.status?.toUpperCase() === "REJECTED").reduce((acc, v) => acc + v.count, 0);
  const totalVolunteers = activeVolunteers + pendingVolunteers + suspendedVolunteers + rejectedVolunteers;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text">Dashboard Overview</h2>
        <p className="text-text-muted">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Compliance Warning Banner */}
      {analyticsData?.receiptStats && analyticsData.receiptStats.pendingCount > 0 && (
        <div className="bg-accent/5 border border-accent/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in-down">
          <div className="flex items-start gap-3 text-left">
            <AlertTriangle className="text-accent w-5 h-5 mt-0.5 shrink-0 animate-pulse" />
            <div className="space-y-1">
              <h4 className="font-bold text-text text-sm">Receipt Compliance Action Required</h4>
              <p className="text-text-muted text-xs leading-relaxed">
                There are <strong className="text-text">{analyticsData.receiptStats.pendingCount}</strong> successful payments that do not have associated PDF receipts compiled yet.
              </p>
            </div>
          </div>
          <Button
            variant="accent"
            size="sm"
            onClick={handleSyncReceipts}
            isLoading={isSyncing}
            startIcon={<Sparkles size={16} />}
          >
            Auto-Resolve & Sync
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            style={{ animationDelay: `${index * 0.05}s` }}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Contributions (Line Chart) */}
        <div className="bg-surface p-6 rounded-2xl shadow-card border border-border space-y-4">
          <div>
            <h3 className="text-text font-bold text-lg">Monthly Contributions</h3>
            <p className="text-text-muted text-xs">Fundraising aggregates over time</p>
          </div>
          {donationData.length > 0 ? (
            <div className="relative w-full overflow-hidden">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                <defs>
                  <linearGradient id="donation-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {gridLines.map((gl, i) => (
                  <g key={i}>
                    <line 
                      x1={paddingLeft} 
                      y1={gl.y} 
                      x2={paddingLeft + chartWidth} 
                      y2={gl.y} 
                      stroke="var(--color-border)" 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x={paddingLeft - 10} 
                      y={gl.y + 4} 
                      textAnchor="end" 
                      className="fill-text-muted text-[10px] font-bold"
                    >
                      ₹{gl.val >= 1000 ? (gl.val / 1000).toFixed(0) + 'k' : gl.val}
                    </text>
                  </g>
                ))}

                {/* Area under the line */}
                <path 
                  d={areaPath} 
                  fill="url(#donation-gradient)" 
                  className="transition-all duration-500"
                />

                {/* Main line path */}
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="var(--color-primary)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-500"
                />

                {/* Data point circles */}
                {donationData.map((d, i) => {
                  const x = paddingLeft + (i / Math.max(1, donationData.length - 1)) * chartWidth;
                  const y = paddingTop + chartHeight - (d.total / Math.max(1, maxDonation)) * chartHeight;
                  return (
                    <g key={i} className="group/dot">
                      <circle
                        cx={x}
                        cy={y}
                        r="5"
                        className="fill-primary stroke-white stroke-2 cursor-pointer transition-all duration-200 group-hover/dot:r-7"
                      />
                      <title>{`${d.month}: ₹${d.total.toLocaleString("en-IN")}`}</title>
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {donationData.map((d, i) => {
                  const x = paddingLeft + (i / Math.max(1, donationData.length - 1)) * chartWidth;
                  return (
                    <text 
                      key={i} 
                      x={x} 
                      y={paddingTop + chartHeight + 20} 
                      textAnchor="middle" 
                      className="fill-text-muted text-[10px] font-bold"
                    >
                      {d.month}
                    </text>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">
              No contribution trend data available
            </div>
          )}
        </div>

        {/* User Onboarding (Bar Chart) */}
        <div className="bg-surface p-6 rounded-2xl shadow-card border border-border space-y-4">
          <div>
            <h3 className="text-text font-bold text-lg">User Onboarding</h3>
            <p className="text-text-muted text-xs">New user registrations by month</p>
          </div>
          {registrationData.length > 0 ? (
            <div className="relative w-full overflow-hidden">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                {/* Grid Lines */}
                {regGridLines.map((gl, i) => (
                  <g key={i}>
                    <line 
                      x1={paddingLeft} 
                      y1={gl.y} 
                      x2={paddingLeft + chartWidth} 
                      y2={gl.y} 
                      stroke="var(--color-border)" 
                      strokeDasharray="4 4" 
                    />
                    <text 
                      x={paddingLeft - 10} 
                      y={gl.y + 4} 
                      textAnchor="end" 
                      className="fill-text-muted text-[10px] font-bold"
                    >
                      {gl.val}
                    </text>
                  </g>
                ))}

                {/* Bars */}
                {registrationData.map((d, i) => {
                  const spacing = chartWidth / registrationData.length;
                  const barWidth = Math.max(12, spacing * 0.5);
                  const x = paddingLeft + i * spacing + (spacing - barWidth) / 2;
                  const y = paddingTop + chartHeight - (d.count / Math.max(1, maxReg)) * chartHeight;
                  const height = (d.count / Math.max(1, maxReg)) * chartHeight;

                  return (
                    <g key={i} className="group/bar">
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        rx="4"
                        className="fill-accent hover:fill-accent-light transition-all duration-300 cursor-pointer"
                      />
                      <text
                        x={x + barWidth / 2}
                        y={y - 6}
                        textAnchor="middle"
                        className="fill-text text-[9px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200"
                      >
                        {d.count}
                      </text>
                      <text 
                        x={x + barWidth / 2} 
                        y={paddingTop + chartHeight + 20} 
                        textAnchor="middle" 
                        className="fill-text-muted text-[10px] font-bold"
                      >
                        {d.month}
                      </text>
                      <title>{`${d.month}: ${d.count} registrations`}</title>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-text-muted text-sm">
              No onboarding trend data available
            </div>
          )}
        </div>
      </div>

      {/* Operational Highlights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Volunteer Application Status Splits */}
        <div className="bg-surface p-6 rounded-2xl shadow-card border border-border space-y-6">
          <div>
            <h3 className="text-text font-bold text-lg">Volunteer Applications</h3>
            <p className="text-text-muted text-xs">Lifecycle splits for NGO volunteers</p>
          </div>
          <div className="space-y-4">
            {/* Active / Approved */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-success flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-success inline-block"></span>
                  Approved
                </span>
                <span className="text-text">{activeVolunteers} / {totalVolunteers}</span>
              </div>
              <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                <div className="bg-success h-full transition-all duration-500" style={{ width: `${totalVolunteers > 0 ? (activeVolunteers / totalVolunteers) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Pending */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-accent flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block"></span>
                  Pending Review
                </span>
                <span className="text-text">{pendingVolunteers} / {totalVolunteers}</span>
              </div>
              <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full transition-all duration-500" style={{ width: `${totalVolunteers > 0 ? (pendingVolunteers / totalVolunteers) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Suspended */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-muted flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-text-muted inline-block"></span>
                  Suspended
                </span>
                <span className="text-text">{suspendedVolunteers} / {totalVolunteers}</span>
              </div>
              <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                <div className="bg-text-muted h-full transition-all duration-500" style={{ width: `${totalVolunteers > 0 ? (suspendedVolunteers / totalVolunteers) * 100 : 0}%` }}></div>
              </div>
            </div>

            {/* Rejected */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-danger flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger inline-block"></span>
                  Rejected
                </span>
                <span className="text-text">{rejectedVolunteers} / {totalVolunteers}</span>
              </div>
              <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                <div className="bg-danger h-full transition-all duration-500" style={{ width: `${totalVolunteers > 0 ? (rejectedVolunteers / totalVolunteers) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Receipt Compliance Analytics */}
        <div className="bg-surface p-6 rounded-2xl shadow-card border border-border flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h3 className="text-text font-bold text-lg">Receipt Compliance</h3>
            <p className="text-text-muted text-xs">PDF generation status for successful donations</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg p-4 rounded-xl space-y-1">
              <span className="text-xs text-text-muted font-medium">Generated Receipts</span>
              <p className="text-2xl font-bold text-success">
                {analyticsData?.receiptStats?.generatedCount || 0}
              </p>
            </div>
            <div className="bg-bg p-4 rounded-xl space-y-1">
              <span className="text-xs text-text-muted font-medium">Pending Generation</span>
              <p className={`text-2xl font-bold ${analyticsData?.receiptStats?.pendingCount && analyticsData.receiptStats.pendingCount > 0 ? 'text-accent' : 'text-text'}`}>
                {analyticsData?.receiptStats?.pendingCount || 0}
              </p>
            </div>
          </div>
          <div className="border-t border-border/40 pt-4 flex justify-between items-center text-xs">
            <span className="text-text-muted font-medium">Compliance Rate</span>
            <span className="font-bold text-primary">
              {analyticsData?.receiptStats?.successPayments 
                ? ((analyticsData.receiptStats.generatedCount / analyticsData.receiptStats.successPayments) * 100).toFixed(1) + '%'
                : '100%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

