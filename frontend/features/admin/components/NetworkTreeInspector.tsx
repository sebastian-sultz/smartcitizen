"use client";

import React, { useState, useEffect } from "react";
import {
  getNonAdminUsers,
  getUserNetwork,
  getUserNetworkStats,
  getAdminPaymentHistory,
} from "../api";
import { UserResponse } from "@/features/shared/auth/types";
import {
  PaymentAdminResponse,
  ReferralNetworkMember,
  UserNetworkStats,
} from "../types";
import { Card, CardContent } from "@/components/ui/Card";
import { TableComponent, Header } from "@/components/ui/TableComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { formatDate, cn, formatUserSlug } from "@/lib/utils";
import {
  GitFork,
  GitCommit,
  Heart,
  Users,
  Calendar,
  Eye,
  Layers,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export const NetworkTreeInspector = () => {
  const [coordinators, setCoordinators] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Search and Sort states for main tree list
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  // Detail Modal States
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Tab 2: Direct Donations State
  const [donations, setDonations] = useState<PaymentAdminResponse[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [donationsPage, setDonationsPage] = useState(1);
  const [donationsLimit, setDonationsLimit] = useState(5);
  const [totalDonations, setTotalDonations] = useState(0);

  // Tab 3: Referred Downline State
  const [downline, setDownline] = useState<ReferralNetworkMember[]>([]);
  const [loadingDownline, setLoadingDownline] = useState(false);
  const [recursive, setRecursive] = useState(false);
  const [downlinePage, setDownlinePage] = useState(1);
  const [downlineLimit, setDownlineLimit] = useState(5);
  const [totalDownlineRows, setTotalDownlineRows] = useState(0);

  // Tab 4: Network Stats State
  const [networkStats, setNetworkStats] = useState<UserNetworkStats | null>(
    null,
  );
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchCoordinators = async () => {
    try {
      setIsLoading(true);
      const res = await getNonAdminUsers(page, limit, search, sort);
      if (res && res.users) {
        // Filter users who have referral activity, or coordinators.
        // For visual clarity, we show all users and let admins audit their network tree.
        setCoordinators(res.users);
        if (res.pagination) {
          setTotalRows(res.pagination.total_rows);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load coordinators");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
  }, [page, limit, sort]);

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchCoordinators();
    }
  };

  const triggerSearch = () => {
    setPage(1);
    fetchCoordinators();
  };

  // Tab 2: Load User's Direct Donations
  const fetchUserDonations = async (userId: string) => {
    try {
      setLoadingDonations(true);
      const res = await getAdminPaymentHistory({
        userId,
        page: donationsPage,
        limit: donationsLimit,
      });
      if (res) {
        setDonations(res.data || []);
        if (res.pagination) {
          setTotalDonations(res.pagination.total_rows);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDonations(false);
    }
  };

  // Tab 3: Load User's Downline Referrals
  const fetchUserDownline = async (userId: string) => {
    try {
      setLoadingDownline(true);
      const res = await getUserNetwork(
        userId,
        recursive,
        downlinePage,
        downlineLimit,
      );
      if (res && res.referrals) {
        setDownline(res.referrals);
        // Backend pagination inside UserNetworkResponse could be mapped if included,
        // otherwise we fallback on length or local page sizes
        setTotalDownlineRows(
          res.referrals.length < downlineLimit && downlinePage === 1
            ? res.referrals.length
            : 100,
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDownline(false);
    }
  };

  // Tab 4: Load Cumulative Stats
  const fetchUserNetworkStats = async (userId: string) => {
    try {
      if (!networkStats) {
        setLoadingStats(true);
      }
      const res = await getUserNetworkStats(userId);
      if (res) {
        setNetworkStats(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      if (activeTab === "donations") {
        fetchUserDonations(selectedUser.id);
      } else if (activeTab === "downline") {
        fetchUserDownline(selectedUser.id);
      } else if (activeTab === "stats") {
        fetchUserNetworkStats(selectedUser.id);
      }
    }
  }, [
    selectedUser,
    activeTab,
    donationsPage,
    donationsLimit,
    downlinePage,
    downlineLimit,
    recursive,
  ]);

  const handleOpenDetails = (user: UserResponse) => {
    setSelectedUser(user);
    setActiveTab("profile");
    setDonationsPage(1);
    setDonationsLimit(5);
    setDownlinePage(1);
    setDownlineLimit(5);
    setRecursive(false);
    setDonations([]);
    setDownline([]);
    setNetworkStats(null);
    setDetailsOpen(true);
  };

  const columns: Header<UserResponse>[] = [
    {
      label: "Coordinator Name",
      render: (u) => (
        <span className="text-[14px] font-bold text-text">{u.name}</span>
      ),
    },
    {
      label: "Phone",
      render: (u) => (
        <span className="text-[13px] font-semibold text-text-muted">
          {u.phone}
        </span>
      ),
    },
    {
      label: "Type",
      render: (u) => (
        <Badge variant={u.user_type === "volunteer" ? "success" : "secondary"}>
          {u.user_type === "volunteer" ? "Volunteer" : "Member"}
        </Badge>
      ),
    },
    {
      label: "Direct Referrals",
      render: (u) => (
        <span className="text-[14px] font-bold text-text">
          {u.total_referrals || 0} users
        </span>
      ),
    },
    {
      label: "Direct Donation Contributions",
      render: (u) => (
        <span className="text-[14px] font-bold text-text">
          ₹{(u.total_amount || 0).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      label: "Actions",

      render: (u) => (
        <Button
          variant="ghost-primary"
          size="sm"
          shape="square"
          onClick={() => handleOpenDetails(u)}
          startIcon={<GitFork size={16} />}
        >
          Inspect
        </Button>
      ),
    },
  ];

  // Tab 2: User Donations Columns
  const donationColumns: Header<PaymentAdminResponse>[] = [
    {
      label: "Date",
      render: (p) => (
        <span className="text-[12px] text-text-muted">
          {formatDate(p.createdAt, "short")}
        </span>
      ),
    },
    {
      label: "Amount",
      render: (p) => <span className="font-bold">₹{p.amount / 100}</span>,
    },
    {
      label: "UTR / Ref",
      render: (p) => (
        <span className="font-mono text-text-muted text-[12px]">
          {p.providerReferenceId || "N/A"}
        </span>
      ),
    },
    {
      label: "Status",
      render: (p) => (
        <Badge variant={p.status === "SUCCESS" ? "success" : "warning"}>
          {p.status}
        </Badge>
      ),
    },
  ];

  // Tab 3: Referred Downline Columns
  const downlineColumns: Header<ReferralNetworkMember>[] = [
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
  ];

  return (
    <div className="space-y-6">
      {/* Search and Sort Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
            {/* Search Input */}
            <div className="flex-1 max-w-md space-y-1">
              <span className="text-xs font-semibold text-text-muted">
                Search Coordinator (Name / Phone / ID)
              </span>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter name, phone or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  className="bg-bg/40 focus:bg-white"
                  size="sm"
                />
                <Button
                  variant="primary"
                  onClick={triggerSearch}
                  startIcon={<Search size={16} />}
                  size="sm"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Sort Select */}
            <div className="w-full sm:w-[200px] space-y-1">
              <span className="text-xs font-semibold text-text-muted">
                Sort By
              </span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger
                  className="w-full bg-bg/40 font-semibold border-border rounded-xl"
                  size="sm"
                >
                  <SelectValue placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="referrals_desc">Most Referrals</SelectItem>
                  <SelectItem value="donations_desc">Most Donations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coordinators Table */}
      <TableComponent
        headers={columns}
        data={coordinators}
        loading={isLoading}
        emptyMessage="No coordinators found"
        pagination={{
          page,
          limit,
          total: totalRows,
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
      />

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent
          size="xl"
          className="h-[90vh] md:h-auto md:max-h-[85vh] md:max-w-4xl flex flex-col overflow-hidden"
        >
          <DialogHeader className="border-b border-border/60 pb-4 shrink-0">
            <DialogTitle>Referral Network Audit</DialogTitle>
            <DialogDescription>
              Audit coordinator referral links, downline members, and
              fundraising amounts
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4"
              >
                <TabsList className="shrink-0 w-full mb-4 grid grid-cols-2 gap-2 h-auto p-0 bg-transparent md:flex md:h-12 md:bg-bg md:p-1.5 md:rounded-xl md:mb-6">
                  <TabsTrigger
                    value="profile"
                    className="text-xs md:text-sm px-2 md:px-3 py-2.5 bg-bg/80 border border-border/30 data-[state=active]:bg-surface data-[state=active]:border-transparent md:py-2 md:bg-transparent md:border-none md:data-[state=active]:bg-surface"
                  >
                    Profile Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="donations"
                    className="text-xs md:text-sm px-2 md:px-3 py-2.5 bg-bg/80 border border-border/30 data-[state=active]:bg-surface data-[state=active]:border-transparent md:py-2 md:bg-transparent md:border-none md:data-[state=active]:bg-surface"
                  >
                    Direct Donations
                  </TabsTrigger>
                  <TabsTrigger
                    value="downline"
                    className="text-xs md:text-sm px-2 md:px-3 py-2.5 bg-bg/80 border border-border/30 data-[state=active]:bg-surface data-[state=active]:border-transparent md:py-2 md:bg-transparent md:border-none md:data-[state=active]:bg-surface"
                  >
                    Downline Referrals
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="text-xs md:text-sm px-2 md:px-3 py-2.5 bg-bg/80 border border-border/30 data-[state=active]:bg-surface data-[state=active]:border-transparent md:py-2 md:bg-transparent md:border-none md:data-[state=active]:bg-surface"
                  >
                    Network Metrics
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                  {/* TAB 1: Profile Info */}
                  <TabsContent value="profile" className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-border/40 pb-6">
                      {selectedUser.profile_photo ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-muted">
                          <Image
                            src={selectedUser.profile_photo}
                            alt={selectedUser.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg bg-primary/10 border-2 border-primary/20 text-primary shrink-0">
                          {selectedUser.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-text">
                          {selectedUser.name}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">
                          Citizen ID: {selectedUser.member_id || "GSC-MEMBER"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-xs font-semibold text-text-muted mb-0.5">
                          Phone Number
                        </span>
                        <span className="font-bold text-text">
                          {selectedUser.phone}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-text-muted mb-0.5">
                          Role Type
                        </span>
                        <span className="font-bold text-text uppercase">
                          {selectedUser.user_type}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-text-muted mb-0.5">
                          Total Amount Contributed
                        </span>
                        <span className="font-bold text-text">
                          ₹
                          {(selectedUser.total_amount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-text-muted mb-0.5">
                          Total Transactions
                        </span>
                        <span className="font-bold text-text">
                          {selectedUser.total_payments || 0} payments
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-text-muted mb-0.5">
                          Direct Referrals
                        </span>
                        <span className="font-bold text-text">
                          {selectedUser.total_referrals || 0} users
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-text-muted mb-0.5">
                          Joined Date
                        </span>
                        <span className="font-bold text-text">
                          {formatDate(selectedUser.created_at, "long-in")}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: Direct Donations */}
                  <TabsContent value="donations" className="space-y-4">
                    <TableComponent
                      headers={donationColumns}
                      data={donations}
                      emptyMessage="No direct donations found"
                      pagination={{
                        page: donationsPage,
                        limit: donationsLimit,
                        total: totalDonations,
                        onChange: (p, l) => {
                          setDonationsPage(p);
                          setDonationsLimit(l);
                        },
                        pageSizeOptions: [5, 10, 20, 50],
                      }}
                    />
                  </TabsContent>

                  {/* TAB 3: Downline Network */}
                  <TabsContent value="downline" className="space-y-4">
                    <div className="flex items-center justify-between bg-bg p-3.5 rounded-2xl border border-border/40 shrink-0">
                      <div className="flex items-center gap-2">
                        <Layers size={18} className="text-primary" />
                        <span className="text-sm font-bold text-text">
                          Recursive Search ({recursive ? "Enabled" : "Disabled"}
                          )
                        </span>
                      </div>
                      <Switch
                        checked={recursive}
                        onCheckedChange={(val) => {
                          setRecursive(val);
                          setDownlinePage(1);
                        }}
                      />
                    </div>

                    <TableComponent
                      headers={downlineColumns}
                      data={downline}
                      emptyMessage="No referred users found in downline network"
                      pagination={{
                        page: downlinePage,
                        limit: downlineLimit,
                        total: totalDownlineRows,
                        onChange: (p, l) => {
                          setDownlinePage(p);
                          setDownlineLimit(l);
                        },
                        pageSizeOptions: [5, 10, 20, 50],
                      }}
                    />
                  </TabsContent>

                  {/* TAB 4: Network Impact Stats */}
                  <TabsContent value="stats" className="space-y-4">
                    {loadingStats ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin border-4 border-primary border-t-transparent w-8 h-8 rounded-full" />
                      </div>
                    ) : networkStats ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Metric 1 */}
                        <Card className="bg-bg/40">
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                              <Users size={20} />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-text-muted block">
                                Direct Referrals
                              </span>
                              <span className="text-xl font-bold text-text">
                                {networkStats.directReferralsCount} referred
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Metric 2 */}
                        <Card className="bg-bg/40">
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0">
                              <GitCommit size={20} />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-text-muted block">
                                Total Downline Network
                              </span>
                              <span className="text-xl font-bold text-text">
                                {networkStats.totalDownlineCount} total users
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Metric 3 */}
                        <Card className="bg-bg/40">
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="p-3 bg-success-bg rounded-xl text-success shrink-0">
                              <Heart size={20} />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-text-muted block">
                                Direct Referral Donations
                              </span>
                              <span className="text-xl font-bold text-text">
                                ₹
                                {networkStats.directReferralDonationAmount.toLocaleString(
                                  "en-IN",
                                )}
                              </span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Metric 4 */}
                        <Card className="bg-bg/40">
                          <CardContent className="p-5 flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                              <GitFork size={20} />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-text-muted block">
                                Total Network Fundraising
                              </span>
                              <span className="text-xl font-bold text-text">
                                ₹
                                {networkStats.totalNetworkDonationAmount.toLocaleString(
                                  "en-IN",
                                )}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-text-muted">
                        Failed to compute metrics.
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => setDetailsOpen(false)}
                >
                  Close Inspector
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
