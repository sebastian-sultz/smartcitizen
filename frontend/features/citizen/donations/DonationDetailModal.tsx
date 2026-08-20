"use client";

import { useState, useEffect } from "react";
import { Payment } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getStatusColor } from "./helpers";
import {
  Download,
  Calendar,
  ShieldCheck,
  Heart,
  FileText,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { getReceiptStatus, updateDonationTaxDetails } from "../api";
import { downloadBlob } from "@/lib/utils";

interface DonationDetailModalProps {
  donation: Payment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export default function DonationDetailModal({
  donation,
  isOpen,
  onOpenChange,
  onRefresh,
}: DonationDetailModalProps) {
  const [localDonation, setLocalDonation] = useState<Payment | null>(null);
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalDonation(donation);
    if (donation) {
      setPan(donation.donorPan || "");
      setAddress(donation.donorAddress || "");
    }
  }, [donation, isOpen]);

  if (!localDonation) return null;

  const formattedDate = new Date(localDonation.createdAt).toLocaleString(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );

  const fetchAndOpenReceipt = async () => {
    try {
      setDownloading(true);
      const res = await getReceiptStatus(localDonation.merchantOrderId);
      if (res && res.url) {
        downloadBlob(
          res.url,
          `80G_Receipt_${localDonation.merchantOrderId}.pdf`,
        );
      } else if (res && res.status === "processing") {
        toast.info(
          "Your tax receipt is still being compiled. Please wait a moment...",
        );
      } else {
        toast.error("Receipt is currently unavailable.");
      }
    } catch {
      toast.error("Failed to fetch receipt. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadReceipt = () => {
    fetchAndOpenReceipt();
  };

  const handleDownloadCertificate = () => {
    fetchAndOpenReceipt();
  };

  const handleUpdateTaxDetails = async () => {
    const trimmedPan = pan.trim().toUpperCase();
    const trimmedAddress = address.trim();

    if (!trimmedPan || trimmedPan.length !== 10) {
      toast.error("Please enter a valid 10-character PAN number.");
      return;
    }
    if (!trimmedAddress) {
      toast.error("Please enter a billing address.");
      return;
    }

    try {
      setUpdating(true);
      await updateDonationTaxDetails(localDonation.merchantOrderId, {
        donorPan: trimmedPan,
        donorAddress: trimmedAddress,
      });

      toast.success(
        "Tax details updated successfully! Compiling your receipt...",
      );

      setLocalDonation({
        ...localDonation,
        donorPan: trimmedPan,
        donorAddress: trimmedAddress,
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch {
      toast.error("Failed to update tax details. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const isSuccess = localDonation.status.toLowerCase() === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500" fill="currentColor" />
            Transaction Record Details
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Middle Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Amount Card & Metadata Details */}
            <div className="space-y-6">
              {/* Main Transaction Header with Gradient */}
              <div className="bg-gradient-to-br from-primary to-primary-light text-white p-6 rounded-3xl border-none text-center space-y-2 relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider block">
                  Amount Supporting Foundation
                </span>
                <h3 className="text-3xl font-display font-black text-white">
                  ₹{(localDonation.amount / 100).toLocaleString("en-IN")}
                </h3>
                <div className="inline-block pt-1">
                  <Badge variant={getStatusColor(localDonation.status)} size="sm">
                    {isSuccess ? "Success (Verified)" : localDonation.status}
                  </Badge>
                </div>
              </div>

              {/* Key Details Metadata List */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                    Transaction ID
                  </span>
                  <span className="font-mono text-xs text-text font-bold">
                    {localDonation.providerReferenceId ||
                      localDonation.merchantOrderId}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                    Payment Method
                  </span>
                  <span className="font-semibold text-text">
                    {localDonation.paymentMethod || "Online Gateway"}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                    Date & Time
                  </span>
                  <span className="font-semibold text-text flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary/70" />
                    {formattedDate}
                  </span>
                </div>

                {localDonation.donorPan && (
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                      Donor PAN
                    </span>
                    <span className="font-semibold text-text font-mono uppercase">
                      {localDonation.donorPan}
                    </span>
                  </div>
                )}

                {localDonation.donorAddress && (
                  <div className="flex justify-between items-start">
                    <span className="text-text-muted font-bold text-xs uppercase tracking-wider pt-0.5">
                      Billing Address
                    </span>
                    <span className="font-semibold text-text text-right text-xs max-w-[200px] break-words">
                      {localDonation.donorAddress}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Tax Forms & Verification Steps */}
            <div className="space-y-6">
              {/* Complete Tax Details Form if Success but details are missing */}
              {isSuccess &&
                (!localDonation.donorPan || !localDonation.donorAddress) && (
                  <div className="bg-amber-50/50 border border-amber-100/70 p-5 rounded-2xl space-y-3.5">
                    <div className="flex gap-2 items-center text-amber-800 text-xs font-bold uppercase tracking-wider">
                      <Info size={14} className="text-amber-600 shrink-0" />
                      <span>Complete Tax Details</span>
                    </div>
                    <p className="text-[11px] text-amber-700/80 leading-relaxed font-semibold">
                      Submit your PAN and Address to make this contribution eligible
                      for an 80G tax rebate slip.
                    </p>

                    <div className="space-y-3 pt-1">
                      <Input
                        label="PAN Number"
                        placeholder="Enter 10-character PAN"
                        value={pan}
                        onChange={(e) =>
                          setPan(e.target.value.toUpperCase().slice(0, 10))
                        }
                        size="sm"
                      />
                      <Input
                        label="Billing Address"
                        placeholder="Enter address for tax receipt"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        size="sm"
                      />
                      <Button
                        onClick={handleUpdateTaxDetails}
                        variant="accent"
                        size="sm"
                        fullWidth
                        isLoading={updating}
                        className="font-bold text-xs uppercase tracking-wider"
                      >
                        Submit Details
                      </Button>
                    </div>
                  </div>
                )}

              {/* Status Verification Timeline Graphics */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Verification Steps
                </span>
                <div className="relative border-l border-border pl-6 ml-3 space-y-4">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                      <CheckCircle2 size={10} />
                    </span>
                    <p className="text-xs font-bold text-text">
                      Transfer Initiated
                    </p>
                  </div>

                  <div className="relative">
                    <span
                      className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
                        isSuccess
                          ? "bg-primary text-white"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      <CheckCircle2 size={10} />
                    </span>
                    <p className="text-xs font-bold text-text">
                      Payment Gateway Clear
                    </p>
                  </div>

                  <div className="relative">
                    <span
                      className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
                        isSuccess &&
                        localDonation.donorPan &&
                        localDonation.donorAddress
                          ? "bg-primary text-white"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      <ShieldCheck size={10} />
                    </span>
                    <p className="text-xs font-bold text-text">
                      80G Benefit Logged
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <DialogFooter>
          {isSuccess && localDonation.donorPan && localDonation.donorAddress ? (
            <Button
              onClick={handleDownloadCertificate}
              variant="accent"
              isLoading={downloading}
              startIcon={<FileText size={14} />}
            >
              80G Tax Slip (PDF)
            </Button>
          ) : (
            <Button
              onClick={handleDownloadReceipt}
              variant="primary"
              isLoading={downloading}
              startIcon={<Download size={14} />}
            >
              Donation Receipt (PDF)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
