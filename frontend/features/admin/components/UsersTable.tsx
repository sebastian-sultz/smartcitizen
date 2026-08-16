"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, FileSpreadsheet, FileText } from "lucide-react";
import { getUsersColumns } from "./UsersColumns";
import { getNonAdminUsers, suspendUser, deleteUser, downloadUsersExport } from "../api";
import { UserResponse } from "@/features/shared/auth/types";
import { UserDetailModal } from "./UserDetailModal";
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

  // Search states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modal States
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  const [prevPage, setPrevPage] = useState(page);
  const [prevLimit, setPrevLimit] = useState(limit);

  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
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
      const res = await getNonAdminUsers(page, limit, debouncedSearch);
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
  }, [page, limit, debouncedSearch]);

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
      await downloadUsersExport(format, { q: debouncedSearch });
      toast.success(`Smart Citizens ${format.toUpperCase()} downloaded successfully`);
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
    <Card className="w-full border-0 sm:border rounded-none sm:rounded-[24px] shadow-none sm:shadow-card bg-transparent sm:bg-white">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-0 sm:p-8 sm:pb-0">
        <div>
          <CardTitle>User Management</CardTitle>
          <p className="text-xs text-text-muted mt-1">
            {totalRows} registered Smart Citizen{totalRows === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search by name, phone or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={16} />}
              size="sm"
              shape="pill"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
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
      </CardHeader>
      <CardContent className="p-0 pt-4 sm:p-8 sm:pt-0">
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
    </Card>
  );
};
