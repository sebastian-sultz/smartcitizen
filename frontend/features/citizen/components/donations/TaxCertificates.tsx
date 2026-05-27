"use client";

import { TaxCertificate } from "../../types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FileText, Download, CheckCircle, ShieldAlert } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";

interface TaxCertificatesProps {
  certificates: TaxCertificate[];
  loading: boolean;
}

export default function TaxCertificates({ certificates, loading }: TaxCertificatesProps) {
  const { showAlert } = useAlert();

  const handleDownload = (fy: string) => {
    showAlert({
      title: "Downloading PDF",
      message: `Tax Certificate 80G for ${fy} is downloading.`,
      type: "success",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse h-24 rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-text">80G Tax Certificates</h3>
        <span className="text-xs text-text-muted font-semibold">Exempt under Section 80G of Income Tax</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <Card key={cert.id} className="rounded-3xl border-primary/5 hover:border-primary/10 hover:shadow-sm transition-all duration-300">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                  <FileText size={22} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-text">{cert.fiscalYear}</h4>
                  <p className="text-xs text-text-muted mt-0.5 font-semibold">
                    Amount: <span className="text-text font-bold">₹{cert.amount.toLocaleString("en-IN")}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {cert.status === "generated" ? (
                      <>
                        <CheckCircle size={12} className="text-emerald-600" />
                        <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Ready for Download</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={12} className="text-amber-500 animate-pulse" />
                        <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Pending Processing</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Button
                  onClick={() => handleDownload(cert.fiscalYear)}
                  disabled={cert.status !== "generated"}
                  className="bg-primary hover:bg-primary/95 text-white font-bold gap-1.5 px-4 py-2.5 h-auto text-xs rounded-xl border-none"
                  aria-label={`Download tax certificate for ${cert.fiscalYear}`}
                >
                  <Download size={13} />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
