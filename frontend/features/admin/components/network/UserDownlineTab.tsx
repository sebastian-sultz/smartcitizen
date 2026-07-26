"use client";

import React, { useState, useEffect } from "react";
import { getUserNetwork } from "../../api";
import { ReferralNetworkMember } from "../../types";
import { TableComponent } from "@/components/ui/TableComponent";
import { Switch } from "@/components/ui/switch";
import { getDownlineColumns } from "./UserDownlineColumns";
import { Layers } from "lucide-react";
import { toast } from "sonner";

interface UserDownlineTabProps {
  userId: string;
}

export const UserDownlineTab = ({ userId }: UserDownlineTabProps) => {
  const [downline, setDownline] = useState<ReferralNetworkMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [recursive, setRecursive] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const columns = getDownlineColumns();

  useEffect(() => {
    const fetchDownline = async () => {
      try {
        setLoading(true);
        const res = await getUserNetwork(userId, recursive, page, limit);
        if (res && res.referrals) {
          setDownline(res.referrals);
          setTotal(
            res.referrals.length < limit && page === 1
              ? res.referrals.length
              : 100,
          );
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
      {/* Header explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-bg/50 p-4 rounded-2xl border border-border/30 gap-2">
        <div>
          <h3 className="text-base font-bold text-text">Referred Members</h3>
          <p className="text-xs text-text-muted mt-0.5">
            List of members who joined using this user's referral link, and their donation amounts.
          </p>
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
              Recursive Search
            </span>
            <span className="text-xs text-text-muted">
              {recursive
                ? "Showing all levels of the downline tree"
                : "Showing only direct referrals (Level 1)"}
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

      {/* Downline Table */}
      <TableComponent
        headers={columns}
        data={downline}
        loading={loading}
        emptyMessage="No referred users found in downline network"
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
