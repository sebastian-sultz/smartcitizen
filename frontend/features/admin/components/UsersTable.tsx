"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Search,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getUsersColumns } from "./UsersColumns";
import {
  getNonAdminUsers,
  suspendUser,
  deleteUser,
  downloadUsersExport,
  UserFilterParams,
} from "../api";
import { UserResponse } from "@/features/shared/auth/types";
import { UserDetailModal } from "./UserDetailModal";
import { UserFiltersDialog } from "./UserFiltersDialog";
import { useAlert } from "@/components/ui/AlertProvider";
import { toast } from "sonner";

export const UsersTable = () => {
  const { showConfirm } = useAlert();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  // Search, filter, and sort states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<UserFilterParams>({});
  const [sort, setSort] = useState<string>("newest");

  // Modal & Dialog States
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [prevSort, setPrevSort] = useState(sort);
  const [prevPage, setPrevPage] = useState(page);
  const [prevLimit, setPrevLimit] = useState(limit);

  if (
    debouncedSearch !== prevSearch ||
    JSON.stringify(filters) !== JSON.stringify(prevFilters) ||
    sort !== prevSort
  ) {
    setPrevSearch(debouncedSearch);
    setPrevFilters(filters);
    setPrevSort(sort);
    setPage(1);
    setIsLoading(true);
  } else if (page !== prevPage || limit !== prevLimit) {
    setPrevPage(page);
    setPrevLimit(limit);
    setIsLoading(true);
  }

  const fetchUsers = async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const res = await getNonAdminUsers(page, limit, {
        ...filters,
        q: debouncedSearch,
        sort,
      });
      if (res && res.users) {
        setUsers(res.users);
        if (res.pagination) {
          setTotalRows(res.pagination.total_rows);
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(false);
  }, [page, limit, debouncedSearch, filters, sort]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.role) count++;
    if (filters.is_suspended !== undefined && filters.is_suspended !== "")
      count++;
    if (filters.min_referrals !== undefined) count++;
    if (filters.max_referrals !== undefined) count++;
    if (filters.min_payments !== undefined) count++;
    if (filters.max_payments !== undefined) count++;
    if (filters.min_amount !== undefined) count++;
    if (filters.max_amount !== undefined) count++;
    if (filters.joined_after) count++;
    if (filters.joined_before) count++;
    return count;
  };
  const activeFiltersCount = getActiveFiltersCount();

  const handleViewDetails = (user: UserResponse) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleSuspendToggle = async (user: UserResponse) => {
    const action = user.is_suspended ? "activate" : "suspend";
    showConfirm({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      message: `Are you sure you want to ${action} user "${user.name}"?`,
      type: "warning",
      onConfirm: async () => {
        try {
          setIsLoading(true);
          await suspendUser(user.id, !user.is_suspended);
          await fetchUsers();
        } catch (err) {
          console.error("Failed to update suspension status:", err);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleDeleteUser = async (user: UserResponse) => {
    showConfirm({
      title: "Delete User",
      message: `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`,
      type: "error",
      onConfirm: async () => {
        try {
          setIsLoading(true);
          await deleteUser(user.id);
          await fetchUsers();
        } catch (err) {
          console.error("Failed to delete user:", err);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      if (format === "csv") setIsExportingCSV(true);
      else setIsExportingPDF(true);

      toast.info(`Preparing Smart Citizens ${format.toUpperCase()} export...`);
      await downloadUsersExport(format, {
        ...filters,
        q: debouncedSearch,
        sort,
      });
      toast.success(
        `Smart Citizens ${format.toUpperCase()} downloaded successfully`,
      );
    } catch (error: unknown) {
      console.error("Export error:", error);
      toast.error(`Failed to export users as ${format.toUpperCase()}`);
    } finally {
      if (format === "csv") setIsExportingCSV(false);
      else setIsExportingPDF(false);
    }
  };

  const columns = getUsersColumns(
    handleViewDetails,
    handleSuspendToggle,
    handleDeleteUser,
  );

  return (
    <Card shape="mobile-flush" className="w-full bg-transparent sm:bg-surface">
      <CardHeader className="flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <CardTitle>User Management</CardTitle>
          <p className="text-xs text-text-muted mt-1">
            {totalRows} registered Smart Citizen{totalRows === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
          {/* Search and Filters trigger row */}
          <div className="flex items-center gap-2 w-full sm:w-80">
            <div className="flex-1">
              <Input
                placeholder="Search by name, phone or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={16} />}
                size="sm"
                shape="pill"
              />
            </div>
            <Button
              variant={activeFiltersCount > 0 ? "default" : "secondary"}
              size="sm"
              className="shrink-0 relative"
              onClick={() => setFiltersOpen(true)}
              startIcon={<SlidersHorizontal size={15} />}
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {/* Sort Select */}
            <div className="w-full sm:w-44">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="newest">Newest Registration</SelectItem>
                  <SelectItem value="oldest">Oldest Registration</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="referrals_desc">
                    Referrals (High to Low)
                  </SelectItem>
                  <SelectItem value="referrals_asc">
                    Referrals (Low to High)
                  </SelectItem>
                  <SelectItem value="donations_desc">
                    Donations (High to Low)
                  </SelectItem>
                  <SelectItem value="donations_asc">
                    Donations (Low to High)
                  </SelectItem>
                  <SelectItem value="payments_desc">
                    Payments (High to Low)
                  </SelectItem>
                  <SelectItem value="payments_asc">
                    Payments (Low to High)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="flex-1 sm:flex-initial whitespace-nowrap"
                variant="secondary"
                size="sm"
                startIcon={
                  <FileSpreadsheet
                    size={15}
                    className="text-emerald-600 shrink-0"
                  />
                }
                onClick={() => handleExport("csv")}
                loading={isExportingCSV}
                title="Export all filtered users as CSV (Includes all hidden fields)"
              >
                Export CSV
              </Button>
              <Button
                className="flex-1 sm:flex-initial whitespace-nowrap"
                variant="secondary"
                size="sm"
                startIcon={
                  <FileText size={15} className="text-primary shrink-0" />
                }
                onClick={() => handleExport("pdf")}
                loading={isExportingPDF}
                title="Export official members roster audit PDF"
              >
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TableComponent
          headers={columns}
          data={users}
          loading={isLoading}
          emptyMessage="No users found"
          className="shadow-none border-0"
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
      </CardContent>

      <UserDetailModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        user={selectedUser}
      />

      <UserFiltersDialog
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filters={filters}
        onApply={setFilters}
        onReset={() => setFilters({})}
      />
    </Card>
  );
};
