"use client";

import React, { useState, useEffect } from "react";
import { getUserNetwork, downloadUserNetworkExport } from "../../api";
import { ReferralNetworkMember } from "../../types";
import { TableComponent } from "@/components/ui/TableComponent";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { getDownlineColumns } from "./UserDownlineColumns";
import { Layers, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

interface UserDownlineTabProps {
  userId: string;
}

export const UserDownlineTab = ({ userId }: UserDownlineTabProps) => {
  const [downline, setDownline] = useState<ReferralNetworkMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [recursive, setRecursive] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const columns = getDownlineColumns();

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      if (format === "csv") setIsExportingCSV(true);
      else setIsExportingPDF(true);

      const modeText = recursive ? "Extended Invitation Network" : "Direct Referrals";
      toast.info(`Preparing ${modeText} ${format.toUpperCase()} export...`);
      await downloadUserNetworkExport(userId, format, recursive);
      toast.success(`${modeText} ${format.toUpperCase()} downloaded successfully`);
    } catch (err: unknown) {
      console.error(err);
      toast.error(`Failed to export network as ${format.toUpperCase()}`);
    } finally {
      if (format === "csv") setIsExportingCSV(false);
      else setIsExportingPDF(false);
    }
  };

  useEffect(() => {
    const fetchDownline = async () => {
      try {
        setLoading(true);
        const res = await getUserNetwork(userId, recursive, page, limit);
        if (res && res.referrals) {
          setDownline(res.referrals);
          setTotal(res.pagination?.total_rows ?? res.referrals.length);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDownline();
  }, [userId, recursive, page, limit]);

  return (
    <div className="space-y-4">
      {/* Header explanation and Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-bg/50 p-4 rounded-2xl border border-border/30 gap-4">
        <div>
          <h3 className="text-base font-bold text-text">Referred Members & Invitation Tree</h3>
          <p className="text-xs text-text-muted mt-0.5">
            List of members who joined using this user&apos;s referral link, with direct and multi-level donation impact.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            startIcon={<FileSpreadsheet size={15} className="text-emerald-600 shrink-0" />}
            onClick={() => handleExport("csv")}
            loading={isExportingCSV}
            title={recursive ? "Export all extended referred team members as CSV" : "Export direct referrals as CSV"}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            startIcon={<FileText size={15} className="text-primary shrink-0" />}
            onClick={() => handleExport("pdf")}
            loading={isExportingPDF}
            title={recursive ? "Export official extended referred network audit PDF" : "Export direct referrals audit PDF"}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Recursive Toggle */}
      <div className="flex items-center justify-between bg-bg p-4 rounded-2xl border border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Layers size={18} className="text-primary" />
          </div>
          <div>
            <span className="text-sm font-bold text-text block">
              Multi-Level Recursive Search
            </span>
            <span className="text-xs text-text-muted">
              {recursive
                ? "Currently displaying all levels of the referred network hierarchy tree"
                : "Currently displaying only direct referrals (Level 1)"}
            </span>
          </div>
        </div>
        <Switch
          checked={recursive}
          onCheckedChange={(val) => {
            setRecursive(val);
            setPage(1);
          }}
        />
      </div>

      {/* Referred Members Table */}
      <TableComponent
        headers={columns}
        data={downline}
        loading={loading}
        emptyMessage="No referred users found in the referral network"
        pagination={{
          page,
          limit,
          total,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
          pageSizeOptions: [10, 25, 50],
        }}
      />
    </div>
  );
};
