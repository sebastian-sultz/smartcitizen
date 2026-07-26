"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserById } from "../../api";
import { UserResponse } from "@/features/shared/auth/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDonationsTab } from "./UserDonationsTab";
import { UserDownlineTab } from "./UserDownlineTab";
import { UserNetworkStatsTab } from "./UserNetworkStatsTab";
import {
  ArrowLeft,
  Heart,
  GitFork,
  BarChart3,
  Link as LinkIcon,
  Phone,
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface NetworkUserDashboardProps {
  userId: string;
}

export const NetworkUserDashboard = ({
  userId,
}: NetworkUserDashboardProps) => {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("donations");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        if (userData) {
          setUser(userData);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/networks")}
          startIcon={<ArrowLeft size={18} />}
        >
          Back to Referral Network Tree
        </Button>
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg font-semibold">User not found</p>
          <p className="text-sm mt-2">
            The requested user could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/networks")}
          startIcon={<ArrowLeft size={18} />}
        >
          Back to Referral Network Tree
        </Button>
      </div>

      {/* Primary User Header Card */}
      <Card className="overflow-hidden border border-border/40 shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Top Profile Summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/30">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              {user.profile_photo ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-muted">
                  <Image
                    src={user.profile_photo}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl bg-primary/10 border-2 border-primary/20 text-primary shrink-0">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
              )}

              {/* Core Info */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-text">{user.name}</h1>
                  <Badge
                    variant={
                      user.user_type === "volunteer" ? "success" : "secondary"
                    }
                  >
                    {user.user_type === "volunteer" ? "Volunteer" : "Member"}
                  </Badge>
                  {user.is_suspended ? (
                    <Badge variant="danger">Suspended</Badge>
                  ) : (
                    <Badge variant="outline" className="text-success border-success/30">
                      Active
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-muted pt-1">
                  <span className="font-semibold text-text">
                    ID: {user.member_id || "GSC-MEMBER"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-text-muted" />
                    {user.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-text-muted" />
                    Joined {formatDate(user.created_at, "long-in")}
                  </span>
                </div>

                {/* Referred By Link */}
                {user.referral_name && user.referral_id && (
                  <div className="flex items-center gap-1.5 pt-1.5">
                    <LinkIcon size={14} className="text-text-muted" />
                    <span className="text-xs text-text-muted">Referred by:</span>
                    <Link
                      href={`/admin/networks/${user.referral_id}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {user.referral_name}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Integrated High-Level Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              icon={CreditCard}
              label="Total Donated"
              value={`₹${(user.total_amount || 0).toLocaleString("en-IN")}`}
              subtitle="Personal contributions"
              accentColor="text-primary bg-primary/10"
            />
            <MetricCard
              icon={Users}
              label="Members Referred"
              value={`${user.total_referrals || 0}`}
              subtitle="Directly invited"
              accentColor="text-accent bg-accent/10"
            />
            <MetricCard
              icon={TrendingUp}
              label="Referral Donations"
              value={`₹${(user.referral_payment_amount || 0).toLocaleString("en-IN")}`}
              subtitle="Raised by referred members"
              accentColor="text-success bg-success-bg"
            />
            <MetricCard
              icon={GitFork}
              label="Total Impact"
              value={`₹${((user.total_amount || 0) + (user.referral_payment_amount || 0)).toLocaleString("en-IN")}`}
              subtitle="Personal + Referred"
              accentColor="text-primary bg-primary/10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Focused Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 gap-2 h-auto p-1 bg-bg border border-border/40 rounded-2xl">
          <TabsTrigger
            value="donations"
            className="text-xs sm:text-sm py-3 font-bold rounded-xl data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <Heart size={16} className="mr-2 hidden sm:inline-block" />
            Direct Donations
          </TabsTrigger>
          <TabsTrigger
            value="downline"
            className="text-xs sm:text-sm py-3 font-bold rounded-xl data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <GitFork size={16} className="mr-2 hidden sm:inline-block" />
            Referred Members
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="text-xs sm:text-sm py-3 font-bold rounded-xl data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-sm"
          >
            <BarChart3 size={16} className="mr-2 hidden sm:inline-block" />
            Network Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="mt-6">
          <UserDonationsTab userId={user.id} />
        </TabsContent>

        <TabsContent value="downline" className="mt-6">
          <UserDownlineTab userId={user.id} />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <UserNetworkStatsTab userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  accentColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle: string;
  accentColor: string;
}) => (
  <div className="bg-bg/50 rounded-2xl p-4 border border-border/30 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-text-muted">{label}</span>
      <div className={`p-2 rounded-xl shrink-0 ${accentColor}`}>
        <Icon size={16} />
      </div>
    </div>
    <div>
      <span className="text-xl font-bold text-text block">{value}</span>
      <span className="text-[11px] text-text-muted block mt-0.5">{subtitle}</span>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-48" />
    <div className="bg-surface rounded-2xl border border-border/40 p-6 space-y-6">
      <div className="flex items-center gap-5">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border/30">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    </div>
    <Skeleton className="h-12 w-full rounded-2xl" />
    <Skeleton className="h-64 rounded-2xl" />
  </div>
);
