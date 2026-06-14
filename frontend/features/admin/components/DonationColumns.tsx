import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { PaymentAdminResponse } from "../types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Eye, FileText } from "lucide-react";

interface GetDonationColumnsProps {
  onViewDetails: (payment: PaymentAdminResponse) => void;
  onDownloadReceipt: (merchantOrderId: string) => void;
}

export const getDonationColumns = ({
  onViewDetails,
  onDownloadReceipt,
}: GetDonationColumnsProps): Header<PaymentAdminResponse>[] => [
  {
    label: "Date",
    render: (p) => (
      <span className="text-[13px] text-text-muted">
        {formatDate(p.createdAt, "short-time")}
      </span>
    ),
  },
  {
    label: "Donor",
    render: (p) => (
      <div className="flex flex-col">
        <span className="text-[14px] font-bold text-text">{p.donorName || "Guest"}</span>
        <span className="text-[12px] text-text-muted">{p.donorEmail || "N/A"}</span>
      </div>
    ),
  },
  {
    label: "Amount",
    render: (p) => (
      <span className="text-[14px] font-bold text-text">
        ₹{(p.amount / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    label: "UTR / Gateway Ref",
    render: (p) => (
      <span className="text-[13px] font-mono text-text-muted">
        {p.providerReferenceId || p.merchantOrderId || "N/A"}
      </span>
    ),
  },
  {
    label: "Status",
    render: (p) => {
      const s = p.status;
      let variant: "success" | "warning" | "danger" | "default" = "default";
      if (s === "SUCCESS") variant = "success";
      else if (s === "PENDING") variant = "warning";
      else if (s === "FAILED") variant = "danger";
      return <Badge variant={variant}>{s}</Badge>;
    },
  },
  {
    label: "Tax PAN Status",
    render: (p) => (
      <Badge variant={p.donorPan ? "info" : "muted"}>
        {p.donorPan ? p.donorPan : "No PAN"}
      </Badge>
    ),
  },
  {
    label: "Receipt Number",
    render: (p) => {
      if (p.receiptNumber) {
        return (
          <Button 
            variant="link"
            size="xs"
            onClick={() => onDownloadReceipt(p.merchantOrderId)}
            title="Click to download receipt PDF"
            className="p-0 h-auto font-semibold text-primary hover:text-primary-light"
            startIcon={<FileText size={14} className="shrink-0 text-primary/70" />}
          >
            {p.receiptNumber}
          </Button>
        );
      }
      return (
        <span className="text-[13px] font-semibold text-text-muted/65">
          {p.status === "SUCCESS" ? "Pending Issue" : "—"}
        </span>
      );
    },
  },
  {
    label: "Actions",
    render: (p) => (
      <div className="flex items-center justify-center gap-2">
        <Button 
          variant="ghost-primary"
          size="sm"
          shape="square"
          onClick={() => onViewDetails(p)}
          startIcon={<Eye size={16} />}
        >
          View
        </Button>
      </div>
    ),
  },
];
