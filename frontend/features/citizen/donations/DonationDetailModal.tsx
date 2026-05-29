"use client";

import { DonationRecord } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Download, Calendar, ShieldCheck, Heart, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface DonationDetailModalProps {
  donation: DonationRecord | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DonationDetailModal({ donation, isOpen, onOpenChange }: DonationDetailModalProps) {
  if (!donation) return null;

  const formattedDate = new Date(donation.date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const getStatusColor = (status: DonationRecord["status"]) => {
    switch (status) {
      case "success": return "success";
      case "pending": return "warning";
      default: return "danger";
    }
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt PDF compilation initiated.");
  };

  const handleDownloadCertificate = () => {
    toast.success("80G tax certificate PDF download initiated.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[32px] p-6">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-lg text-text flex items-center gap-2">
            <Heart size={18} className="text-rose-500" fill="currentColor" />
            Transaction Record Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          
          {/* Main Transaction Header */}
          <div className="bg-bg/40 p-5 rounded-3xl border border-border/80 text-center space-y-2">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Amount Supporting Foundation</span>
            <h3 className="text-3xl font-display font-black text-primary">
              ₹{donation.amount.toLocaleString("en-IN")}
            </h3>
            <div className="inline-block">
              <Badge variant={getStatusColor(donation.status)} size="sm">
                {donation.status === "success" ? "Success (Verified)" : donation.status}
              </Badge>
            </div>
          </div>

          {/* Key Details Metadata List */}
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">Campaign Target</span>
              <span className="font-semibold text-text">{donation.purpose}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">Transaction ID</span>
              <span className="font-mono text-xs text-text font-bold">{donation.transactionId}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">Payment Method</span>
              <span className="font-semibold text-text">{donation.paymentMethod}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">Date & Time</span>
              <span className="font-semibold text-text flex items-center gap-1.5">
                <Calendar size={14} className="text-primary/70" />
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Status Verification Timeline Graphics */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Verification Steps</span>
            <div className="relative border-l border-border pl-6 ml-3 space-y-4">
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                  <CheckCircle2 size={10} />
                </span>
                <p className="text-xs font-bold text-text">Transfer Initiated</p>
              </div>

              <div className="relative">
                <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
                  donation.status === "success" ? "bg-primary text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  <CheckCircle2 size={10} />
                </span>
                <p className="text-xs font-bold text-text">Payment Gateway Clear</p>
              </div>

              <div className="relative">
                <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
                  donation.status === "success" ? "bg-primary text-white" : "bg-slate-200 text-slate-400"
                }`}>
                  <ShieldCheck size={10} />
                </span>
                <p className="text-xs font-bold text-text">80G Benefit Logged</p>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-border/80 pt-4 flex gap-3">
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="flex-1 text-xs font-bold py-2.5 h-auto rounded-xl gap-2 border-primary/20 text-primary"
            >
              <Download size={14} />
              Donation Receipt
            </Button>

            {donation.status === "success" && (
              <Button
                onClick={handleDownloadCertificate}
                className="flex-1 text-xs font-bold py-2.5 h-auto rounded-xl gap-2"
              >
                <FileText size={14} />
                80G Tax Slip
              </Button>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
