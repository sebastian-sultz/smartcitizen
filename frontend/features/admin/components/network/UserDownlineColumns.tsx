"use client";

import { ReferralNetworkMember } from "../../types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/TableComponent";
import { formatDate } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";

export const getDownlineColumns = (): Header<ReferralNetworkMember>[] => [
  {
    label: "Member",
    render: (m) => (
      <div className="flex flex-col">
        <span className="font-bold text-text">{m.name}</span>
        <span className="text-[11px] text-text-muted font-mono">
          {m.memberId || "GSC-MEMBER"}
        </span>
      </div>
    ),
  },
  {
    label: "Phone",
    render: (m) => (
      <span className="text-text-muted text-[13px]">
        {m.phone || "N/A"}
      </span>
    ),
  },
  {
    label: "Level",
    render: (m) => (
      <Badge variant={m.level === 1 ? "success" : "neutral"}>
        {m.level === 1 ? "Level 1 (Direct)" : `Level ${m.level} (Indirect)`}
      </Badge>
    ),
  },
  {
    label: "Referred By",
    render: (m) => (
      <div className="flex flex-col">
        <span className="font-medium text-text text-xs">
          {m.sponsorName || "Direct / Top"}
        </span>
        <span className="text-[10px] text-text-muted font-mono">
          {m.sponsorMemberId || ""}
        </span>
      </div>
    ),
  },
  {
    label: "Personal Donations",
    render: (m) => (
      <span className="font-bold text-text">
        ₹{m.totalDirectDonations.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    label: "Direct Referrals",
    render: (m) => (
      <span className="text-xs font-semibold text-text">
        {m.directReferralsCount ?? 0}{" "}
        {m.directReferralsCount === 1 ? "member" : "members"}
      </span>
    ),
  },
  {
    label: "Team Donations",
    render: (m) => (
      <div className="flex flex-col">
        <span className="font-bold text-primary">
          ₹{m.totalNetworkDonations.toLocaleString("en-IN")}
        </span>
        <span className="text-[10px] text-text-muted">
          {m.downlineTreeSize ?? 0} team{" "}
          {m.downlineTreeSize === 1 ? "member" : "members"}
        </span>
      </div>
    ),
  },
  {
    label: "Joined Date",
    render: (m) => (
      <span className="text-text-muted text-[12px]">
        {formatDate(m.joinedAt, "default")}
      </span>
    ),
  },
  {
    label: "Actions",
    render: (m) => (
      <Link href={`/admin/networks/${m.id}`}>
        <Button
          variant="ghost-primary"
          size="sm"
          shape="square"
          startIcon={<Eye size={15} />}
          title="View full referral network for this member"
        >
          View
        </Button>
      </Link>
    ),
  },
];

