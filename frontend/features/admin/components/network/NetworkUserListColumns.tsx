"use client";

import { UserResponse } from "@/features/shared/auth/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/TableComponent";
import { GitFork, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const getNetworkUserListColumns = (): Header<UserResponse>[] => [
  {
    label: "Name",
    render: (u) => {
      const initials = u.name
        ? u.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
        : "SC";
      return (
        <div className="flex items-center gap-3">
          {u.profile_photo ? (
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border bg-bg shrink-0">
              <Image
                src={u.profile_photo}
                alt={u.name}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
              {initials}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-text truncate">
              {u.name}
            </span>
            <span className="text-[11px] font-mono text-text-muted truncate">
              {u.member_id || "GSC-MEMBER"} · {u.phone}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    label: "Direct Referrals",
    render: (u) => (
      <div className="flex items-center gap-1.5">
        <Users size={14} className="text-primary" />
        <span className="text-[14px] font-bold text-text">
          {u.total_referrals || 0} members
        </span>
      </div>
    ),
  },
  {
    label: "Personal Donated",
    render: (u) => (
      <span className="text-[13px] font-semibold text-text">
        ₹{(u.total_amount || 0).toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    label: "Referral Raised",
    render: (u) => (
      <span className="text-[13px] font-bold text-success">
        ₹{(u.referral_payment_amount || 0).toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    label: "Total Impact",
    render: (u) => {
      const totalImpact = (u.total_amount || 0) + (u.referral_payment_amount || 0);
      return (
        <span className="text-[14px] font-bold text-primary">
          ₹{totalImpact.toLocaleString("en-IN")}
        </span>
      );
    },
  },
  {
    label: "Actions",
    render: (u) => (
      <Link href={`/admin/networks/${u.id}`}>
        <Button
          variant="ghost-primary"
          size="sm"
          shape="square"
          startIcon={<GitFork size={16} />}
        >
          Explore Network
        </Button>
      </Link>
    ),
  },
];
