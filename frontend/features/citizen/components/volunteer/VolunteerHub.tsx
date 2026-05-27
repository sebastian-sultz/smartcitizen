"use client";

import { useEffect, useState } from "react";
import { getVolunteerEligibility } from "../../api";
import { VolunteerEligibility } from "../../types";
import { Spinner } from "@/components/ui/spinner";
import EligibilityTracker from "./EligibilityTracker";
import VolunteerApplicationForm from "./VolunteerApplicationForm";
import ApplicationStatus from "./ApplicationStatus";

export default function VolunteerHub() {
  const [eligibility, setEligibility] = useState<VolunteerEligibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionApplied, setSessionApplied] = useState(false);

  const fetchEligibility = async () => {
    try {
      setLoading(true);
      const data = await getVolunteerEligibility();
      setEligibility(data);

      // Check if user has already applied in local storage/session
      const savedApp = localStorage.getItem("volunteer-application-submitted");
      if (savedApp === "true") {
        setSessionApplied(true);
      }
    } catch (err) {
      console.error("Failed to load volunteer eligibility:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibility();
  }, []);

  const handleApplySuccess = () => {
    setSessionApplied(true);
    localStorage.setItem("volunteer-application-submitted", "true");
  };

  const handleReapply = () => {
    setSessionApplied(false);
    localStorage.removeItem("volunteer-application-submitted");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-24 space-y-4">
        <Spinner className="size-10 text-primary animate-spin" />
        <p className="text-text-muted font-bold text-xs uppercase tracking-wider">Verifying eligibility parameters...</p>
      </div>
    );
  }

  if (!eligibility) return null;

  // Decision flow
  // 1. Not eligible (less than 10 joined invites)
  if (!eligibility.isEligible) {
    return <EligibilityTracker eligibility={eligibility} />;
  }

  // 2. Eligible and already submitted the application in this session/state
  if (sessionApplied) {
    return (
      <ApplicationStatus 
        status="pending" 
        adminFeedback="Pending review by Juhu block leader coordinator."
        onReapply={handleReapply}
      />
    );
  }

  // 3. Eligible but has not applied yet
  return <VolunteerApplicationForm onSuccess={handleApplySuccess} />;
}
