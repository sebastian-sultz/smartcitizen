"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Spinner } from "@/components/ui/spinner";
import { getUsersColumns } from "./UsersColumns";
import { getNonAdminUsers, suspendUser, deleteUser } from "../api";
import { UserResponse } from "@/features/shared/auth/types";
import { UserDetailModal } from "./UserDetailModal";

export const UsersTable = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await getNonAdminUsers();
      if (res && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user: UserResponse) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleSuspendToggle = async (user: UserResponse) => {
    const action = user.is_suspended ? "activate" : "suspend";
    const confirmed = window.confirm(`Are you sure you want to ${action} user "${user.name}"?`);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await suspendUser(user.id, !user.is_suspended);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to update suspension status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserResponse) => {
    const confirmed = window.confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      await deleteUser(user.id);
      await fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = getUsersColumns(handleViewDetails, handleSuspendToggle, handleDeleteUser);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : (
          <TableComponent 
            headers={columns} 
            data={users} 
            emptyMessage="No users found" 
            className="shadow-none border-0" 
          />
        )}
      </CardContent>

      <UserDetailModal 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen} 
        user={selectedUser} 
      />
    </Card>
  );
};
