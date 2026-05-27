"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getDonationStats, getDonationHistory, getRecurringDonations, getTaxCertificates } from "../../api";
import { DonationStats as DonationStatsType, DonationRecord, RecurringDonation, TaxCertificate } from "../../types";
import { Spinner } from "@/components/ui/spinner";
import DonationStats from "./DonationStats";
import DonationHistory from "./DonationHistory";
import DonationDetailModal from "./DonationDetailModal";
import RecurringDonations from "./RecurringDonations";
import TaxCertificates from "./TaxCertificates";
import { useSearchParams, useRouter } from "next/navigation";

export default function DonationDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Pick up tab query param if available (e.g. from redirect links)
  const defaultTab = searchParams.get("tab") || "history";

  const [stats, setStats] = useState<DonationStatsType | null>(null);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [recurringPlans, setRecurringPlans] = useState<RecurringDonation[]>([]);
  const [certificates, setCertificates] = useState<TaxCertificate[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({ search: "", status: "all" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, recurringData, certsData] = await Promise.all([
        getDonationStats(),
        getRecurringDonations(),
        getTaxCertificates(),
      ]);
      setStats(statsData);
      setRecurringPlans(recurringData);
      setCertificates(certsData);
    } catch (err) {
      console.error("Failed to load donations baseline:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDonationHistory = async (search: string, status: string) => {
    try {
      setTableLoading(true);
      const list = await getDonationHistory({ search, status });
      setDonations(list);
    } catch (err) {
      console.error("Failed to load donation history table:", err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch donation list whenever filters change
  useEffect(() => {
    loadDonationHistory(filters.search, filters.status);
  }, [filters]);

  const handleFilterChange = (newFilters: { search: string; status: string }) => {
    setFilters(newFilters);
  };

  const handleOpenDetails = (donation: DonationRecord) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const handleTabChange = (val: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", val);
    router.replace(`${window.location.pathname}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <Spinner className="size-10 text-primary animate-spin" />
        <p className="text-text-muted font-bold text-xs uppercase tracking-wider">Loading contributions panel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Stats Summary Panel */}
      <DonationStats stats={stats} />

      {/* Tabs panels */}
      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-bg border border-border p-1 rounded-2xl w-full sm:w-auto flex overflow-x-auto justify-start sm:justify-center mb-6">
          <TabsTrigger value="history" className="text-xs font-bold rounded-xl py-2.5 px-6">
            Donation History
          </TabsTrigger>
          <TabsTrigger value="recurring" className="text-xs font-bold rounded-xl py-2.5 px-6">
            Recurring Contributions
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-xs font-bold rounded-xl py-2.5 px-6">
            Tax Certificates (80G)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="focus:outline-none">
          <DonationHistory
            donations={donations}
            loading={tableLoading}
            onViewDetails={handleOpenDetails}
            onFilterChange={handleFilterChange}
          />
        </TabsContent>

        <TabsContent value="recurring" className="focus:outline-none">
          <RecurringDonations plans={recurringPlans} loading={loading} />
        </TabsContent>

        <TabsContent value="tax" className="focus:outline-none">
          <TaxCertificates certificates={certificates} loading={loading} />
        </TabsContent>
      </Tabs>

      {/* Detail Modal Overlay */}
      <DonationDetailModal
        donation={selectedDonation}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

    </div>
  );
}
