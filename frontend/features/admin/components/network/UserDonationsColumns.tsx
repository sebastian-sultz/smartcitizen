"use client";

import { PaymentAdminResponse } from "../../types";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/ui/TableComponent";
import { formatDate } from "@/lib/utils";

export const getDonationColumns = (): Header<PaymentAdminResponse>[] => [
  {
    label: "Date",
    render: (p) => (
      <span className="text-[12px] text-text-muted">
        {formatDate(p.createdAt, "short")}
      </span>
    ),
  },
  {
    label: "Amount",
    render: (p) => <span className="font-bold">₹{p.amount / 100}</span>,
  },
  {
    label: "UTR / Ref",
    render: (p) => (
      <span className="font-mono text-text-muted text-[12px]">
        {p.providerReferenceId || "N/A"}
      </span>
    ),
  },
  {
    label: "Status",
    render: (p) => (
      <Badge variant={p.status === "SUCCESS" ? "success" : "warning"}>
        {p.status}
      </Badge>
    ),
  },
];
