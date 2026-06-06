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
  const initialTab = searchParams.get("tab") || "history";

  const [stats, setStats] = useState<DonationStatsType | null>(null);
  const [history, setHistory] = useState<Payment[]>([]);
  const [certificates, setCertificates] = useState<TaxCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  const loadDonationData = async () => {
    try {
      setLoading(true);
      const [statsData, historyData, certsData] = await Promise.all([
        getDonationStats(),
        getDonationHistory(),
        getTaxCertificates(),
      ]);
      setStats(statsData || null);
      setHistory(historyData || []);
      setCertificates(certsData || []);
    } catch (err) {
      console.error("Failed to load donation dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshDonationData = async () => {
    try {
      const [statsData, historyData, certsData] = await Promise.all([
        getDonationStats(),
        getDonationHistory(),
        getTaxCertificates(),
      ]);
      setStats(statsData || null);
      setHistory(historyData || []);
      setCertificates(certsData || []);
    } catch (err) {
      console.error("Failed to refresh donation dashboard data:", err);
    }
  };

  useEffect(() => {
    loadDonationData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
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
          <DonationHistory donations={history} />
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
