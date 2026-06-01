"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(id);
};

function ReferralTrackerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref && isValidUUID(ref)) {
      try {
        sessionStorage.setItem("gsc_referral_id", ref);
      } catch (err) {
        console.error("Failed to save referral ID to sessionStorage:", err);
      }
    }
  }, [searchParams]);

  return null;
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralTrackerInner />
    </Suspense>
  );
}
