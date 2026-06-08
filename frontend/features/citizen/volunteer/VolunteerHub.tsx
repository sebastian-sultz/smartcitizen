"use client";

import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
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
      <div className="flex justify-center items-center py-24">
        <Spinner className="size-10 text-primary" />
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
