"use client";

import React from "react";
import { initiatePublicPayment } from "../api";
import HorizontalDonationForm from "@/features/citizen/donations/HorizontalDonationForm";
import { toast } from "sonner";

export function DonationCTA() {
  const handleSuccess = (details: { transactionId: string; amount: number; isManual: boolean }) => {
    toast.success(
      `Thank you! Contribution of ₹${details.amount.toLocaleString(
        "en-IN"
      )} submitted successfully. Reference: ${details.transactionId}`
    );
  };

  return (
    <section className="py-16 md:py-24 bg-bg-alt overflow-hidden">
      <div className="max-content max-w-4xl mx-auto px-4">
        <HorizontalDonationForm
          submitApiCall={initiatePublicPayment}
          onSuccess={handleSuccess}
          title="Support Our Civic Initiatives"
          description="Every contribution helps us power neighborhood assemblies, deploy local community tools, and clean up our environment."
        />
      </div>
    </section>
  );
}
