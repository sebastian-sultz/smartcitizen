"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  getDonationStats, 
  getDonationHistory, 
  getRecurringDonations, 
  getTaxCertificates 
} from "../api";
import { 
  DonationStats as DonationStatsType, 
  DonationRecord, 
  RecurringDonation, 
  TaxCertificate 
} from "../types";

import DonationStats from "./DonationStats";
import DonationHistory from "./DonationHistory";
import RecurringDonations from "./RecurringDonations";
import TaxCertificates from "./TaxCertificates";

function DonationDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "history";

  const [stats, setStats] = useState<DonationStatsType | null>(null);
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [recurring, setRecurring] = useState<RecurringDonation[]>([]);
  const [certificates, setCertificates] = useState<TaxCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  const loadDonationData = async () => {
    try {
      setLoading(true);
      const [statsData, historyData, recurringData, certsData] = await Promise.all([
        getDonationStats(),
        getDonationHistory(),
        getRecurringDonations(),
        getTaxCertificates()
      ]);
      setStats(statsData);
      setHistory(historyData);
      setRecurring(recurringData);
      setCertificates(certsData);
    } catch (err) {
      console.error("Failed to load donation dashboard data:", err);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Stats Panel */}
      <DonationStats stats={stats} />

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Ledger History</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Plans</TabsTrigger>
          <TabsTrigger value="tax">Tax Certificates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <DonationHistory donations={history} />
        </TabsContent>
        
        <TabsContent value="recurring">
          <RecurringDonations plans={recurring} />
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
    <Suspense fallback={
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
      </div>
    }>
      <DonationDashboardContent />
    </Suspense>
  );
}
