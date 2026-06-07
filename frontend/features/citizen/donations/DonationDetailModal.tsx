"use client";

import { Payment } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { getStatusColor } from "./helpers";
import {
  Download,
  Calendar,
  ShieldCheck,
  Heart,
  FileText,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface DonationDetailModalProps {
  donation: Payment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DonationDetailModal({ donation, isOpen, onOpenChange }: DonationDetailModalProps) {
  if (!donation) return null;

  const formattedDate = new Date(donation.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // getStatusColor is imported from helpers.ts

  const handleDownloadReceipt = () => {
    toast.success("Receipt PDF compilation initiated.");
  };

  const handleDownloadCertificate = () => {
    toast.success("80G tax certificate PDF download initiated.");
  };

  const handleShare = () => {
    const text = `I just contributed ₹${(donation.amount / 100).toLocaleString("en-IN")} to SmartCitizen! Join me in empowering our city.`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Share message copied to clipboard!");
      })
      .catch(() => {
        toast.error("Could not copy message automatically.");
      });
  };

  const isSuccess = donation.status.toLowerCase() === "success";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent size="md" className="p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart size={18} className="text-rose-500" fill="currentColor" />
            Transaction Record Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Main Transaction Header with Gradient */}
          <div className="bg-gradient-to-br from-primary to-primary-light text-white p-6 rounded-3xl border-none text-center space-y-2 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider block">
              Amount Supporting Foundation
            </span>
            <h3 className="text-3xl font-display font-black text-white">
              ₹{(donation.amount / 100).toLocaleString("en-IN")}
            </h3>
            <div className="inline-block pt-1">
              <Badge variant={getStatusColor(donation.status)} size="sm">
                {isSuccess ? "Success (Verified)" : donation.status}
              </Badge>
            </div>
          </div>

          {/* Key Details Metadata List */}
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                Transaction ID
              </span>
              <span className="font-mono text-xs text-text font-bold">
                {donation.merchantOrderId}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                Payment Method
              </span>
              <span className="font-semibold text-text">
                {donation.paymentMethod || "Online Gateway"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                Date & Time
              </span>
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Calendar size={14} className="text-primary/70" />
                {formattedDate}
              </span>
            </div>
          </div>

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
                    isSuccess
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

          {/* Action Row & Share */}
          <div className="w-full pt-4 flex flex-col gap-3">
            <Separator className="bg-border/80" />
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadReceipt}
                variant="primary"
                size="sm"
                className="flex-1"
                startIcon={<Download size={14} />}
              >
                Donation Receipt
              </Button>

              {isSuccess && (
                <Button
                  onClick={handleDownloadCertificate}
                  variant="accent"
                  size="sm"
                  className="flex-1"
                  startIcon={<FileText size={14} />}
                >
                  80G Tax Slip
                </Button>
              )}
            </div>

            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              fullWidth
              className="border-primary/20 hover:bg-primary/5"
              startIcon={<Share2 size={14} />}
            >
              Share Your Support
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
