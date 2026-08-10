"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCitizenStore,
  selectIsVolunteer,
} from "@/store/citizenStore";
import { VolunteerEligibility } from "../types";

import EligibilityTracker from "./EligibilityTracker";
import VolunteerApplicationForm from "./VolunteerApplicationForm";
import ApplicationStatus from "./ApplicationStatus";

export default function VolunteerHub() {
  const {
    user,
    loading: storeLoading,
    fetchProfile,
    refreshProfile,
  } = useCitizenStore();
  const isVolunteer = useCitizenStore(selectIsVolunteer);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (storeLoading) {
    return (
      <div className="space-y-6 w-full animate-pulse">
        {/* Eligibility Tracker Skeleton */}
        <Skeleton className="h-64 w-full rounded-card" />

        {/* Application Form Skeleton */}
        <Skeleton className="h-[420px] w-full rounded-card" />
      </div>
    );
  }

  if (!user) return null;

  // Compute eligibility from store data
  const isEligible =
    user.total_referrals >= 10 && user.referral_payment_count >= 10;
  const eligibility: VolunteerEligibility = {
    total_referrals: user.total_referrals,
    referral_payment_count: user.referral_payment_count,
    is_eligible: isEligible || isVolunteer,
    required_referrals: 10,
    required_payments: 10,
  };

  if (isVolunteer) {
    return <ApplicationStatus />;
  }

  // If not applied yet: check eligibility gating
  return (
    <div className="space-y-6">
      <EligibilityTracker eligibility={eligibility} />

      {eligibility.is_eligible && (
        <VolunteerApplicationForm
          user={user}
          onSubmitSuccess={refreshProfile}
        />
      )}
    </div>
  );
}
