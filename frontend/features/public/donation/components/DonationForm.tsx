"use client";

import { useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAlert } from "@/components/ui/AlertProvider";
import UnifiedDonationForm from "./UnifiedDonationForm";
import { initiatePublicPayment } from "../api";

export const DonationForm = () => {
  const { showAlert } = useAlert();
  const [step, setStep] = useState<"form" | "success">("form");
  const [trxDetails, setTrxDetails] = useState({
    id: "",
    amount: 0,
    isManual: false,
  });

  const handleSuccess = (details: {
    transactionId: string;
    amount: number;
    isManual: boolean;
  }) => {
    setTrxDetails({
      id: details.transactionId,
      amount: details.amount,
      isManual: details.isManual,
    });
    setStep("success");
  };

  if (step === "success") {
    return (
      <Card className="flex-1 bg-bg border-border text-center py-8 rounded-[32px]">
        <CardContent className="space-y-6">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
            <CheckCircle2 size={40} className="stroke-[2.5]" />
          </div>
          <h3 className="text-3xl font-display font-black text-text">
            Donation Successful!
          </h3>
          <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
            Thank you for your generous contribution of{" "}
            <span className="font-bold text-text">
              ₹{trxDetails.amount.toLocaleString("en-IN")}
            </span>
            . Your support empowers us to build a smarter nation.
          </p>

          <div className="bg-white p-6 rounded-2xl border border-border inline-block text-left w-full max-w-sm mt-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-semibold">
                Transaction ID
              </span>
              <span className="font-mono font-bold text-text">
                {trxDetails.id}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-semibold">
                Payment Status
              </span>
              <Badge variant={trxDetails.isManual ? "warning" : "success"}>
                {trxDetails.isManual ? "Pending Verification" : "Completed"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              onClick={() =>
                showAlert({
                  title: "Receipt Download",
                  message: "Generating PDF Receipt...",
                  type: "info",
                })
              }
              variant="outline"
              size="sm"
              startIcon={<Download size={14} />}
              className="font-bold"
            >
              Download Receipt
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              size="sm"
              className="font-bold"
            >
              Go to Home Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-stretch">
      <UnifiedDonationForm
        submitApiCall={initiatePublicPayment}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
