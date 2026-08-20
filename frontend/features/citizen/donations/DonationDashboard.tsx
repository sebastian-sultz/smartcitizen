"use client";

import { useEffect, useState, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  getDonationStats,
  getDonationHistory,
  getTaxCertificates,
  initiatePayment,
} from "../api";
import {
  DonationStats as DonationStatsType,
  Payment,
  TaxCertificate,
} from "../types";

import DonationHero from "./DonationHero";
import DonationStats from "./DonationStats";
import HorizontalDonationForm from "./HorizontalDonationForm";
import DonationHistory from "./DonationHistory";
import TaxCertificates from "./TaxCertificates";

function DonationDashboardContent() {
  const [activeTab, setActiveTab] = useState("history");

  const [stats, setStats] = useState<DonationStatsType | null>(null);
  const [history, setHistory] = useState<Payment[]>([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [certificates, setCertificates] = useState<TaxCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setHistoryLoading(true);
      const [statsData, historyRes, certsData] = await Promise.all([
        getDonationStats(),
        getDonationHistory(page, limit, search, status),
        getTaxCertificates(),
      ]);
      setStats(statsData || null);
      setHistory(historyRes?.data || []);
      setTotalHistory(historyRes?.pagination?.total_rows || 0);
      setCertificates(certsData || []);
    } catch (err) {
      console.error("Failed to load initial donation data:", err);
    } finally {
      setLoading(false);
      setHistoryLoading(false);
    }
  };

  const loadHistoryOnly = async () => {
    try {
      setHistoryLoading(true);
      const historyRes = await getDonationHistory(page, limit, search, status);
      setHistory(historyRes?.data || []);
      setTotalHistory(historyRes?.pagination?.total_rows || 0);
    } catch (err) {
      console.error("Failed to load donation history page:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const refreshDonationData = async () => {
    try {
      const [statsData, historyRes, certsData] = await Promise.all([
        getDonationStats(),
        getDonationHistory(page, limit, search, status),
        getTaxCertificates(),
      ]);
      setStats(statsData || null);
      setHistory(historyRes?.data || []);
      setTotalHistory(historyRes?.pagination?.total_rows || 0);
      setCertificates(certsData || []);
    } catch (err) {
      console.error("Failed to refresh donation dashboard data:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (activeTab === "history") {
        loadHistoryOnly();
      }
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, status, activeTab]);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val);
  };

  const handleDonationSuccess = (details: {
    transactionId: string;
    amount: number;
    isManual: boolean;
  }) => {
    toast.success(
      `Thank you! Contribution of ₹${details.amount.toLocaleString(
        "en-IN",
      )} submitted successfully. Reference: ${details.transactionId}`,
    );
    // Silent refresh to update the history table and dashboard cards
    refreshDonationData();
  };

  if (loading) {
    return (
      <div className="space-y-8 w-full animate-pulse">
        {/* Donation Hero Skeleton */}
        <Skeleton className="h-40 w-full rounded-card" />
        
        {/* KPI Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-28 w-full rounded-card" />
          <Skeleton className="h-28 w-full rounded-card" />
          <Skeleton className="h-28 w-full rounded-card" />
        </div>

        {/* Quick Donation Form Skeleton */}
        <Skeleton className="h-24 w-full rounded-card" />

        {/* Tabs and Content list Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
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
      {/* Hero Section containing narrative */}
      <DonationHero />

      {/* KPI Stats Panel */}
      <DonationStats stats={stats} />

      {/* Quick Donation Panel */}
      <HorizontalDonationForm
        submitApiCall={initiatePayment}
        onSuccess={handleDonationSuccess}
      />

      {/* Tabs Layout */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="history">Donation History</TabsTrigger>
          <TabsTrigger value="tax">Tax Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <DonationHistory
            donations={history}
            loading={historyLoading}
            page={page}
            limit={limit}
            total={totalHistory}
            searchTerm={search}
            onSearchChange={handleSearchChange}
            statusFilter={status}
            onStatusChange={handleStatusChange}
            onPaginationChange={(p, l) => {
              setHistoryLoading(true);
              setPage(p);
              setLimit(l);
            }}
            onRefresh={refreshDonationData}
          />
        </TabsContent>

        <TabsContent value="tax">
          <TaxCertificates certificates={certificates} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DonationDashboard() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 w-full animate-pulse">
          <Skeleton className="h-40 w-full rounded-card" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Skeleton className="h-28 w-full rounded-card" />
            <Skeleton className="h-28 w-full rounded-card" />
            <Skeleton className="h-28 w-full rounded-card" />
          </div>
          <Skeleton className="h-24 w-full rounded-card" />
        </div>
      }
    >
      <DonationDashboardContent />
    </Suspense>
  );
}
