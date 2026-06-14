import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eye, Ban, UserCheck, Trash2 } from "lucide-react";
import Image from "next/image";
import { UserResponse } from "@/features/shared/auth/types";
import { formatUserSlug } from "@/lib/utils";

export const getUsersColumns = (
  onViewDetails: (user: UserResponse) => void,
  onSuspendToggle: (user: UserResponse) => void,
  onDeleteUser: (user: UserResponse) => void
): Header<UserResponse>[] => [
  {
    label: "User",
    render: (user) => {
      const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
        : "SC";
      return (
        <div className="flex items-center gap-3">
          {user.profile_photo ? (
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border bg-bg shrink-0">
              <Image 
                src={user.profile_photo} 
                alt={user.name} 
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
            <span className="text-[14px] font-bold text-text truncate">{user.name}</span>
            <span className="text-[11px] font-mono text-text-muted truncate">{formatUserSlug(user.id)}</span>
          </div>
        </div>
      );
    },
  },
  {
    label: "Mobile",
    render: (user) => <span className="text-[14px] text-text-muted">{user.phone}</span>,
  },
  {
    label: "Role",
    render: (user) => {
      const isVolunteer = user.user_type === "volunteer";
      const isAdmin = user.user_type === "admin";
      return (
        <Badge variant={isAdmin ? "primary-light" : isVolunteer ? "success" : "secondary"}>
          {isAdmin ? "Coordinator Admin" : isVolunteer ? "Volunteer" : "Smart Citizen"}
        </Badge>
      );
    },
  },
  {
    label: "Donations",
    render: (user) => (
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold text-text">₹{(user.total_amount ?? 0).toLocaleString("en-IN")}</span>
        <span className="text-[11px] text-text-muted">{user.total_payments ?? 0} payments</span>
      </div>
    ),
  },
  {
    label: "Referrals",
    render: (user) => (
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold text-text">{user.total_referrals ?? 0} referred</span>
        <span className="text-[11px] text-text-muted">{user.referral_payment_count ?? 0} paid</span>
      </div>
    ),
  },
  {
    label: "Events Registered",
    render: (user) => (
      <Badge variant="primary-light" size="sm">
        {user.total_events_registered ?? 0}
      </Badge>
    ),
  },
  {
    label: "Status",
    render: (user) => (
      <Badge variant={user.is_suspended ? "danger" : "success"}>
        {user.is_suspended ? "Suspended" : "Active"}
      </Badge>
    ),
  },
  {
    label: "Actions",
    render: (user) => (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost-primary"
          size="sm"
          shape="square"
          onClick={() => onViewDetails(user)}
          startIcon={<Eye size={16} />}
        >
          View
        </Button>
        <Button 
          variant={user.is_suspended ? "ghost-success" : "ghost-danger"}
          size="sm"
          shape="square"
          onClick={() => onSuspendToggle(user)}
          startIcon={user.is_suspended ? <UserCheck size={16} /> : <Ban size={16} />}
        >
          {user.is_suspended ? "Activate" : "Suspend"}
        </Button>
        <Button 
          variant="ghost-danger"
          size="sm"
          shape="square"
          onClick={() => onDeleteUser(user)}
          startIcon={<Trash2 size={16} />}
        >
          Delete
        </Button>
      </div>
    ),
  },
];
