import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { FileText } from "lucide-react";
import { PaymentAdminResponse } from "../types";

interface DonationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: PaymentAdminResponse | null;
  onDownloadReceipt: (merchantOrderId: string) => void;
}

export const DonationDetailsDialog = ({
  open,
  onOpenChange,
  payment,
  onDownloadReceipt,
}: DonationDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Donation Details & Receipt Audit</DialogTitle>
          <DialogDescription>Full transaction payload details from payment gateway</DialogDescription>
        </DialogHeader>

        {payment && (
          <div className="space-y-6 text-sm mt-4">
            <div className="grid grid-cols-2 gap-6 border-b border-border/40 pb-5">
              <div>
                <span className="text-xs font-semibold text-text-muted block mb-0.5">Transaction ID</span>
                <span className="font-mono font-bold text-text break-all">{payment.id}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block mb-0.5">Merchant Order ID</span>
                <span className="font-mono font-bold text-text break-all">{payment.merchantOrderId}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block mb-0.5">Donor Contact Info</span>
                <span className="font-bold text-text block">{payment.donorName || "Guest"}</span>
                <span className="text-xs text-text-muted block">{payment.donorEmail || "No Email"}</span>
                <span className="text-xs text-text-muted block">{payment.donorPhone || "No Phone"}</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-text-muted block mb-0.5">Tax (PAN) / Address</span>
                <span className="font-mono font-bold text-text block">{payment.donorPan || "No PAN registered"}</span>
                <span className="text-xs text-text-muted block break-all">{payment.donorAddress || "No Address registered"}</span>
              </div>
            </div>

            {/* Receipt Status Card */}
            <div className="bg-bg/40 border border-border/50 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-text-muted block uppercase tracking-wider mb-0.5">Tax Receipt</span>
                <span className="font-semibold text-text text-sm">
                  {payment.receiptNumber 
                    ? `Issued: ${payment.receiptNumber}` 
                    : payment.status === "SUCCESS" 
                      ? "Pending Auto-Generation" 
                      : "Unavailable"}
                </span>
              </div>
              {payment.receiptNumber && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadReceipt(payment.merchantOrderId)}
                  startIcon={<FileText size={14} />}
                >
                  Download Receipt
                </Button>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-border/40">
              <Button variant="secondary" onClick={() => onOpenChange(false)} size="sm">Close Inspector</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
