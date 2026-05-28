"use client";

import { Download, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

import { useAlert } from "@/components/ui/AlertProvider";

const mockDonations = [
  {
    id: "TRX-829310",
    date: "15 May 2026",
    amount: "₹500",
    purpose: "General Fund",
    status: "Success",
  }
];

export const ContributionHistory = () => {
  const { showAlert } = useAlert();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Contribution History</CardTitle>
      </CardHeader>
      <CardContent>
        {mockDonations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-[13px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                  <th className="pb-3 text-[13px] font-bold text-text-muted uppercase tracking-wider">Transaction ID</th>
                  <th className="pb-3 text-[13px] font-bold text-text-muted uppercase tracking-wider">Amount</th>
                  <th className="pb-3 text-[13px] font-bold text-text-muted uppercase tracking-wider">Purpose</th>
                  <th className="pb-3 text-[13px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-[13px] font-bold text-text-muted uppercase tracking-wider text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-bg/50 transition-colors">
                    <td className="py-4 text-[14px] text-text font-medium">{donation.date}</td>
                    <td className="py-4 text-[14px] text-text-muted font-mono">{donation.id}</td>
                    <td className="py-4 text-[14px] text-text font-bold">{donation.amount}</td>
                    <td className="py-4 text-[14px] text-text-muted">{donation.purpose}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[12px] font-bold uppercase rounded-full tracking-wider">
                        {donation.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => showAlert("Downloading receipt...")}>
                        <Download size={14} className="mr-2" />
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState 
            icon={Receipt}
            title="No contributions yet"
            description="When you support the foundation, your donation receipts will appear here."
            ctaText="Make a Donation"
            ctaHref="/donation"
          />
        )}
      </CardContent>
    </Card>
  );
};
