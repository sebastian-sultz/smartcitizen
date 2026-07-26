"use client";

import React, { useState, useEffect } from "react";
import { getAdminPaymentHistory } from "../../api";
import { PaymentAdminResponse } from "../../types";
import { TableComponent } from "@/components/ui/TableComponent";
import { getDonationColumns } from "./UserDonationsColumns";
import { toast } from "sonner";

interface UserDonationsTabProps {
  userId: string;
}

export const UserDonationsTab = ({ userId }: UserDonationsTabProps) => {
  const [donations, setDonations] = useState<PaymentAdminResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const columns = getDonationColumns();

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await getAdminPaymentHistory({
          userId,
          page,
          limit,
        });
        if (res) {
          setDonations(res.data || []);
          if (res.pagination) {
            setTotal(res.pagination.total_rows);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userId, page, limit]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-bg/50 p-4 rounded-2xl border border-border/30 gap-2">
        <div>
          <h3 className="text-base font-bold text-text">Direct Donations</h3>
          <p className="text-xs text-text-muted mt-0.5">
            History of payments and donations made directly by this user.
          </p>
        </div>
      </div>

      <TableComponent
        headers={columns}
        data={donations}
        loading={loading}
        emptyMessage="No direct donations found for this user"
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
