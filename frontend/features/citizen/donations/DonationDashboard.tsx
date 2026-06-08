"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  getDonationStats,
  getDonationHistory,
  getTaxCertificates,
} from "../api";
import {
  DonationStats as DonationStatsType,
  Payment,
  TaxCertificate,
} from "../types";

import DonationHero from "./DonationHero";
import DonationStats from "./DonationStats";
import DonationHistory from "./DonationHistory";
import TaxCertificates from "./TaxCertificates";

function DonationDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "history";

  const [stats, setStats] = useState<DonationStatsType | null>(null);
  const [history, setHistory] = useState<Payment[]>([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [certificates, setCertificates] = useState<TaxCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const loadDonationData = async () => {
    try {
      const offset = (page - 1) * limit;
      const [statsData, historyRes, certsData] = await Promise.all([
        getDonationStats(),
        getDonationHistory(offset, limit),
        getTaxCertificates(),
      ]);
      setStats(statsData || null);
      setHistory(historyRes?.data || []);
      setTotalHistory(historyRes?.totalCount || 0);
      setCertificates(certsData || []);
    } catch (err) {
      console.error("Failed to load donation dashboard data:", err);
    } finally {
      setLoading(false);
      setHistoryLoading(false);
    }
  };

  const loadHistoryOnly = async () => {
    try {
      const offset = (page - 1) * limit;
      const historyRes = await getDonationHistory(offset, limit);
      setHistory(historyRes?.data || []);
      setTotalHistory(historyRes?.totalCount || 0);
    } catch (err) {
      console.error("Failed to load donation history page:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const refreshDonationData = async () => {
    try {
      const offset = (page - 1) * limit;
      const [statsData, historyRes, certsData] = await Promise.all([
        getDonationStats(),
        getDonationHistory(offset, limit),
        getTaxCertificates(),
      ]);
      setStats(statsData || null);
      setHistory(historyRes?.data || []);
      setTotalHistory(historyRes?.totalCount || 0);
      setCertificates(certsData || []);
    } catch (err) {
      console.error("Failed to refresh donation dashboard data:", err);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadDonationData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      Promise.resolve().then(() => {
        loadHistoryOnly();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, loading]);

  const handleTabChange = (val: string) => {
    router.push(`/citizen/donations?tab=${val}`);
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
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section containing narrative and Quick Donation Panel */}
      <DonationHero onSuccess={handleDonationSuccess} />

      {/* KPI Stats Panel */}
      <DonationStats stats={stats} />

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
            onPaginationChange={(p, l) => {
              setHistoryLoading(true);
              setPage(p);
              setLimit(l);
            }}
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
        <div className="flex justify-center items-center py-24">
          <Spinner className="size-10 text-primary" />
        </div>
      }
    >
      <DonationDashboardContent />
    </Suspense>
  );
}
