"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { getVolunteerEligibility, getDashboardStats } from "../../api";
import { VolunteerEligibility, DashboardStats } from "../../types";

import EligibilityTracker from "./EligibilityTracker";
import VolunteerApplicationForm from "./VolunteerApplicationForm";
import ApplicationStatus from "./ApplicationStatus";

export default function VolunteerHub() {
  const [eligibility, setEligibility] = useState<VolunteerEligibility | null>(null);
  const [dbStats, setDbStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const loadVolunteerContext = async () => {
    try {
      setLoading(true);
      const [elData, stats] = await Promise.all([
        getVolunteerEligibility(),
        getDashboardStats()
      ]);
      setEligibility(elData);
      setDbStats(stats);
    } catch (err) {
      console.error("Failed to load volunteer gating checklist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteerContext();
  }, [applicationSubmitted]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
      </div>
    );
  }

  if (!eligibility || !dbStats) return null;

  // Let's check status: if user already submitted application, or is pending/approved/rejected
  const currentStatus = applicationSubmitted ? "pending" : dbStats.volunteerStatus;

  if (currentStatus !== "not_applied") {
    return <ApplicationStatus status={currentStatus} />;
  }

  // If not applied yet: check eligibility gating
  return (
    <div className="space-y-6">
      <EligibilityTracker eligibility={eligibility} />
      
      {eligibility.isEligible && (
        <VolunteerApplicationForm onSubmitSuccess={() => setApplicationSubmitted(true)} />
      )}
    </div>
  );
}
