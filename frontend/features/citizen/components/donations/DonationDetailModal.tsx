"use client";

import { DonationRecord } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, Download, CheckCircle, Clock, AlertTriangle, CreditCard, Heart, ArrowRight } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";

interface DonationDetailModalProps {
  donation: DonationRecord | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DonationDetailModal({ donation, isOpen, onOpenChange }: DonationDetailModalProps) {
  const { showAlert } = useAlert();

  if (!donation) return null;

  const handleDownload = (type: "receipt" | "certificate") => {
    showAlert({
      title: "Download Started",
      message: `Your donation ${type} is being generated and downloaded.`,
      type: "success",
    });
  };

  const getStatusIcon = (status: DonationRecord["status"]) => {
    switch (status) {
      case "success": return <CheckCircle className="text-emerald-500 shrink-0" size={20} />;
      case "pending": return <Clock className="text-amber-500 shrink-0 animate-spin" size={20} />;
      default: return <AlertTriangle className="text-rose-500 shrink-0" size={20} />;
    }
  };

  const getStatusBadge = (status: DonationRecord["status"]) => {
    switch (status) {
      case "success": return <Badge variant="success" className="font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-wider">SUCCESSFUL</Badge>;
      case "pending": return <Badge variant="warning" className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-wider">PENDING</Badge>;
      default: return <Badge variant="destructive" className="font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-wider">FAILED</Badge>;
    }
  };

  const formattedDate = new Date(donation.date).toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[32px] p-6 text-left">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="font-display font-black text-lg text-text flex items-center gap-2">
            <Heart className="text-primary" size={20} />
            Transaction Receipt
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Main Amount Card */}
          <div className="text-center p-6 bg-primary/5 border border-primary/10 rounded-3xl">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Amount Supported</span>
            <p className="text-4xl font-display font-black text-primary mt-1">
              ₹{donation.amount.toLocaleString("en-IN")}
            </p>
            <div className="mt-3 flex justify-center">{getStatusBadge(donation.status)}</div>
          </div>

          {/* Details list */}
          <div className="space-y-3.5 text-xs text-text-muted font-semibold">
            <div className="flex justify-between border-b border-border/80 pb-2.5">
              <span>Campaign / Purpose</span>
              <span className="font-bold text-text text-right max-w-[200px] truncate">{donation.purpose}</span>
            </div>
            
            <div className="flex justify-between border-b border-border/80 pb-2.5 font-mono">
              <span>Transaction ID</span>
              <span className="font-bold text-text select-all">{donation.transactionId}</span>
            </div>

            <div className="flex justify-between border-b border-border/80 pb-2.5">
              <span>Date & Time</span>
              <span className="font-bold text-text">{formattedDate}</span>
            </div>

            <div className="flex justify-between border-b border-border/80 pb-2.5">
              <span>Payment Channel</span>
              <span className="font-bold text-text flex items-center gap-1">
                <CreditCard size={13} className="text-primary/70" />
                {donation.paymentMethod}
              </span>
            </div>
          </div>

          {/* Transaction Steps Timeline */}
          <div className="space-y-3 bg-bg/40 border border-border/80 p-4 rounded-2xl">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Processing Timeline</h4>
            <div className="space-y-4 relative pl-5 border-l border-border ml-1.5 mt-2 text-[11px] font-medium">
              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 bg-white rounded-full p-0.5">
                  <CheckCircle className="text-primary" size={14} />
                </span>
                <p className="text-text font-bold">Initiated</p>
                <p className="text-text-muted text-[10px]">Payment requested by checkout client</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 bg-white rounded-full p-0.5">
                  {donation.status === "success" ? (
                    <CheckCircle className="text-primary" size={14} />
                  ) : donation.status === "pending" ? (
                    <Clock className="text-amber-500 animate-spin" size={14} />
                  ) : (
                    <AlertTriangle className="text-rose-500" size={14} />
                  )}
                </span>
                <p className="text-text font-bold">Authorized</p>
                <p className="text-text-muted text-[10px]">Settled via Payment Aggregator gateway</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[27px] top-0.5 bg-white rounded-full p-0.5">
                  {donation.status === "success" ? (
                    <CheckCircle className="text-emerald-500" size={14} />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-border bg-white" />
                  )}
                </span>
                <p className="text-text font-bold">Completed & Recorded</p>
                <p className="text-text-muted text-[10px]">80G Tax receipt ledger generated</p>
              </div>
            </div>
          </div>

          {/* Receipt download buttons */}
          {donation.status === "success" && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                onClick={() => handleDownload("receipt")}
                variant="outline"
                className="border-primary/10 text-primary hover:bg-primary/5 font-bold gap-2 py-3 rounded-2xl h-auto text-xs"
              >
                <Download size={14} />
                Payment Receipt
              </Button>
              <Button
                onClick={() => handleDownload("certificate")}
                className="bg-primary hover:bg-primary/95 text-white font-bold gap-2 py-3 rounded-2xl h-auto text-xs border-none"
              >
                <FileText size={14} />
                80G Certificate
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
