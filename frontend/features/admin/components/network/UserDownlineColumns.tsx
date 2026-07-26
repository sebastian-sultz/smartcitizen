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
    label: "Member Name",
    render: (m) => <span className="font-bold text-text">{m.name}</span>,
  },
  {
    label: "Phone",
    render: (m) => (
      <span className="text-text-muted text-[13px]">{m.phone}</span>
    ),
  },
  {
    label: "Level",
    render: (m) => <Badge variant="neutral">Lvl {m.level}</Badge>,
  },
  {
    label: "Direct Donations",
    render: (m) => (
      <span className="font-semibold">
        ₹{m.totalDirectDonations.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    label: "Network Donations",
    render: (m) => (
      <span className="font-bold text-primary">
        ₹{m.totalNetworkDonations.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    label: "Joined At",
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
        >
          View
        </Button>
      </Link>
    ),
  },
];
