"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { getUsersColumns } from "./UsersColumns";
import { getNonAdminUsers, suspendUser, deleteUser } from "../api";
import { UserResponse } from "@/features/shared/auth/types";
import { UserDetailModal } from "./UserDetailModal";
import { useAlert } from "@/components/ui/AlertProvider";

export const UsersTable = () => {
  const { showConfirm } = useAlert();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const columns = getUsersColumns(
    handleViewDetails,
    handleSuspendToggle,
    handleDeleteUser,
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle>User Management</CardTitle>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, phone or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
            size="sm"
            shape="pill"
          />
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
    </Card>
  );
};
