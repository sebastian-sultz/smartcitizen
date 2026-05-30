"use client";

import { TaxCertificate } from "../types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Calendar, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface TaxCertificatesProps {
  certificates: TaxCertificate[];
}

export default function TaxCertificates({ certificates }: TaxCertificatesProps) {
  const handleDownload = (fy: string) => {
    toast.success(`80G tax benefit receipt for ${fy} downloaded.`);
  };

  return (
    <div className="space-y-6">
      {/* 80G tax rebate banner info */}
      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-3xl flex gap-3.5 items-start">
        <ShieldCheck className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <div className="text-xs text-blue-900 font-medium leading-relaxed">
          <span className="font-bold">Income Tax 80G Benefits:</span> Under Section 80G of the Income Tax Act, citizens are eligible to claim a tax rebate for direct contributions made to our foundation. Receipts are generated automatically within 15 days of fiscal-year closure.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id} className="rounded-[32px] border-primary/5 shadow-sm overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-primary/5 rounded-2xl text-primary">
                  <FileText size={20} />
                </div>
                <Badge variant={cert.status === "generated" ? "success" : "warning"} size="sm">
                  {cert.status}
                </Badge>
              </div>

              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Fiscal Period</p>
                <h4 className="text-base font-display font-black text-text mt-0.5">
                  {cert.fiscalYear}
                </h4>
                <p className="text-xs font-semibold text-primary mt-1">
                  Tax Deductible: ₹{cert.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <Button
                onClick={() => handleDownload(cert.fiscalYear)}
                disabled={cert.status !== "generated"}
                variant="outline"
                className="w-full text-xs font-bold py-2 h-auto rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5"
              >
                <Download size={14} />
                Download Slip (PDF)
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
