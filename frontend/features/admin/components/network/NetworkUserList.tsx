"use client";

import React, { useState, useEffect } from "react";
import { getNonAdminUsers } from "../../api";
import { UserResponse } from "@/features/shared/auth/types";
import { Card, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getNetworkUserListColumns } from "./NetworkUserListColumns";
import { Search } from "lucide-react";
import { toast } from "sonner";

export const NetworkUserList = () => {
  const [coordinators, setCoordinators] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("referrals_desc");

  const columns = getNetworkUserListColumns();

  const fetchCoordinators = async () => {
    try {
      setIsLoading(true);
      const res = await getNonAdminUsers(
        page,
        limit,
        search,
        sort,
        true, // Always filter for active referrers (> 0 referrals) on the backend
      );
      if (res) {
        setCoordinators(res.users || []);
        if (res.pagination) {
          setTotalRows(res.pagination.total_rows);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoordinators();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, limit, sort, search]);

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

  return (
    <div className="space-y-6">
      {/* Search and Sort Toolbar */}
      <Card>
        <CardContent >
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
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
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
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>

            {/* Sort Select */}
            <div className="w-full sm:w-[200px] space-y-1">
              <span className="text-xs font-semibold text-text-muted block">
                Sort By
              </span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger
                  className="w-full bg-bg/40 font-semibold border-border rounded-xl"
                  size="sm"
                >
                  <SelectValue placeholder="Most Referrals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="referrals_desc">Most Referrals</SelectItem>
                  <SelectItem value="donations_desc">Most Donations</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coordinators Referral Table */}
      <TableComponent
        headers={columns}
        data={coordinators}
        loading={isLoading}
        emptyMessage={
          search
            ? `No referral coordinators found matching "${search}"`
            : "No active referral coordinators found"
        }
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
    </div>
  );
};
