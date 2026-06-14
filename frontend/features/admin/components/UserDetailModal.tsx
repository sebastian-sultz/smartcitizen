import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserResponse } from "@/features/shared/auth/types";
import { formatDate, formatUserSlug } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
}

export const UserDetailModal = ({ open, onOpenChange, user }: UserDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="border-b border-border/60 pb-4 shrink-0">
          <DialogTitle>
            User Profile Details
          </DialogTitle>
          <DialogDescription>
            Detailed metadata and engagement stats for this member
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-6">
          {user && (
            <div className="space-y-6">
              {/* Header profile cards */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg/40 p-4 border border-border/60 rounded-2xl">
                {user.profile_photo ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border border-border bg-bg shrink-0">
                    <Image
                      src={user.profile_photo}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl bg-primary/10 border-2 border-primary/20 text-primary shrink-0">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : "SC"}
                  </div>
                )}
                <div className="text-center sm:text-left min-w-0">
                  <h3 className="font-display font-bold text-lg text-text truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1">ID: {formatUserSlug(user.id)}</p>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Mobile / Phone</span>
                  <span className="font-bold text-text">{user.phone}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Role / User Type</span>
                  <span className="font-bold text-text">
                    {user.user_type === "volunteer" 
                      ? "Volunteer" 
                      : user.user_type === "admin" 
                        ? "Coordinator Admin" 
                        : "Smart Citizen"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Total Amount Contributed</span>
                  <span className="font-bold text-text">₹{(user.total_amount ?? 0).toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Total Payments</span>
                  <span className="font-bold text-text">{user.total_payments ?? 0} transactions</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Referrals Count</span>
                  <span className="font-bold text-text">{user.total_referrals ?? 0} referred members</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Referred Payments Generated</span>
                  <span className="font-bold text-text">{user.referral_payment_count ?? 0} paid</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Events Registered</span>
                  <span className="font-bold text-text">{user.total_events_registered ?? 0} events</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Joined Date</span>
                  <span className="font-bold text-text">
                    {user.created_at ? formatDate(user.created_at, "long-in") : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-text-muted mb-1">Account Status</span>
                  <Badge variant={user.is_suspended ? "danger" : "success"}>
                    {user.is_suspended ? "Suspended" : "Active"}
                  </Badge>
                </div>
                {user.referral_id && (
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">Referral ID / Code Used</span>
                    <span className="font-bold text-text font-mono">{user.referral_id}</span>
                  </div>
                )}
                {user.referral_name && (
                  <div>
                    <span className="block text-xs font-semibold text-text-muted mb-1">Referred By</span>
                    <span className="font-bold text-text">{user.referral_name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
