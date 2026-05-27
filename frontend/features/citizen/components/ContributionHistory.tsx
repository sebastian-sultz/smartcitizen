"use client";

import { useEffect, useState } from "react";
import { Download, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useAlert } from "@/components/ui/AlertProvider";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import { DonationRecord } from "../types";
import { getDonationHistory } from "../api";
import { Badge } from "@/components/ui/Badge";

export const ContributionHistory = () => {
  const { showAlert } = useAlert();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getDonationHistory();
        // Just show successful ones for simple history
        setDonations(data.filter((d) => d.status === "success"));
      } catch (err) {
        console.error("Failed to load contribution summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const tableHeaders: Header<DonationRecord>[] = [
    {
      label: "Date",
      render: (row) => (
        <span className="text-xs font-semibold text-text">
          {new Date(row.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      label: "Transaction ID",
      render: (row) => (
        <span className="font-mono text-xs text-text-muted font-bold">
          {row.transactionId}
        </span>
      ),
    },
    {
      label: "Amount",
      render: (row) => (
        <span className="text-xs font-black text-text">
          ₹{row.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      label: "Purpose",
      render: (row) => (
        <span className="text-xs font-semibold text-text-muted">
          {row.purpose}
        </span>
      ),
    },
    {
      label: "Status",
      render: (row) => (
        <Badge variant="success" className="font-bold text-[9px] uppercase tracking-wider">
          {row.status}
        </Badge>
      ),
    },
    {
      label: "Receipt",
      render: (row) => (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              showAlert({
                title: "Generating Receipt",
                message: `Downloading receipt for ${row.transactionId}...`,
                type: "success",
              })
            }
            className="rounded-xl px-3 py-1.5 h-auto text-xs"
          >
            <Download size={12} className="mr-1.5 inline" />
            PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="rounded-[40px] border-primary/5 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-lg font-bold text-text">
          Contribution History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-text-muted font-semibold text-xs uppercase tracking-wider">
            Loading history...
          </div>
        ) : donations.length > 0 ? (
          <div className="border border-border/80 rounded-2xl overflow-hidden bg-white">
            <TableComponent
              headers={tableHeaders}
              data={donations.slice(0, 5)} // Show top 5 recent contributions
              loading={loading}
              emptyMessage="No successful contributions found."
            />
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="No contributions yet"
            description="When you support the foundation, your donation receipts will appear here."
            ctaText="Make a Donation"
            ctaHref="/citizen/donations"
          />
        )}
      </CardContent>
    </Card>
  );
};
