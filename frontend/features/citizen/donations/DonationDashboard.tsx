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
  DonationRecord,
  TaxCertificate,
} from "../types";

import DonationHero from "./DonationHero";
import DonationStats from "./DonationStats";
import DonationHistory from "./DonationHistory";
import TaxCertificates from "./TaxCertificates";
import CheckoutModal from "./CheckoutModal";

function DonationDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "history";

  const [stats, setStats] = useState<DonationStatsType | null>(null);
  const [history, setHistory] = useState<DonationRecord[]>([]);
  const [certificates, setCertificates] = useState<TaxCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Checkout modal state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    amount: number;
    purpose: string;
    provider: "phonepe" | "razorpay";
  } | null>(null);

  const loadDonationData = async () => {
    try {
      setLoading(true);
      const [statsData, historyData, certsData] = await Promise.all([
        getDonationStats(),
        getDonationHistory(),
        getTaxCertificates(),
      ]);
      setStats(statsData);
      setHistory(historyData);
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

  const handleDonateInitiate = (data: {
    amount: number;
    purpose: string;
    provider: "phonepe" | "razorpay";
  }) => {
    setCheckoutData(data);
    setCheckoutOpen(true);
  };

  const handlePaymentSuccess = (details: {
    transactionId: string;
    paymentMethod: string;
  }) => {
    if (!checkoutData) return;

    // Create a new donation history record
    const newRecord: DonationRecord = {
      id: "sim-" + details.transactionId,
      transactionId: details.transactionId,
      amount: checkoutData.amount,
      purpose: checkoutData.purpose,
      paymentMethod: details.paymentMethod,
      status: "success",
      date: new Date().toISOString(),
    };

    // Prepend to transaction history list
    setHistory((prev) => [newRecord, ...prev]);

    // Update KPI metrics locally
    setStats((prev) => {
      if (!prev) {
        return {
          lifetimeDonated: checkoutData.amount,
          donatedThisYear: checkoutData.amount,
          donatedLastMonth: checkoutData.amount,
          totalTransactions: 1,
          averageAmount: checkoutData.amount,
          donorLevel: "Bronze",
        };
      }

      const updatedTotal = prev.lifetimeDonated + checkoutData.amount;
      const updatedCount = prev.totalTransactions + 1;
      const updatedAvg = Math.round(updatedTotal / updatedCount);

      // Simple donor level progression calculation
      let newLevel = prev.donorLevel;
      if (updatedTotal >= 25000) newLevel = "Platinum";
      else if (updatedTotal >= 10000) newLevel = "Gold";
      else if (updatedTotal >= 5000) newLevel = "Silver";

      return {
        ...prev,
        lifetimeDonated: updatedTotal,
        donatedThisYear: prev.donatedThisYear + checkoutData.amount,
        donatedLastMonth: prev.donatedLastMonth + checkoutData.amount,
        totalTransactions: updatedCount,
        averageAmount: updatedAvg,
        donorLevel: newLevel,
      };
    });

    toast.success(
      `Thank you! Contribution of ₹${checkoutData.amount.toLocaleString(
        "en-IN"
      )} processed successfully.`
    );
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
      <DonationHero onDonateInitiate={handleDonateInitiate} />

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

      {/* Checkout Gateway Simulator Modal */}
      {checkoutData && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          amount={checkoutData.amount}
          purpose={checkoutData.purpose}
          provider={checkoutData.provider}
          onSuccess={handlePaymentSuccess}
        />
      )}
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
