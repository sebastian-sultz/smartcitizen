"use client";

import React, { useState, useEffect } from "react";
import { MoreHorizontal, Edit, Trash2, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { AwarenessActivity } from "../types/awareness";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const mockActivities: AwarenessActivity[] = [
  {
    id: "1",
    title: "Clean City Campaign",
    categoryId: "cat1",
    categoryName: "Environment",
    description: "A city-wide cleanup drive.",
    date: "2024-05-15",
    status: "Active",
  },
  {
    id: "2",
    title: "Blood Donation Drive",
    categoryId: "cat2",
    categoryName: "Health",
    description: "Annual blood donation camp.",
    date: "2024-06-10",
    status: "Active",
  },
  {
    id: "3",
    title: "Digital Literacy Workshop",
    categoryId: "cat3",
    categoryName: "Education",
    description: "Teaching basic computer skills.",
    date: "2024-04-20",
    status: "Inactive",
  },
];

export function AwarenessList() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Awareness Activities</h2>
          <p className="text-text-muted">Manage and track all social awareness initiatives.</p>
        </div>
        <Button variant="primary" startIcon={<Plus size={20} />}>
          Add Activity
        </Button>
      </div>

      <div className="bg-surface rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <Input 
              type="text" 
              placeholder="Search by title or category..." 
              icon={<Search size={18} />}
              className="py-2 h-10 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="All Categories">
              <SelectTrigger className="w-44 py-2 px-4 h-10 text-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Environment">Environment</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="All Status">
              <SelectTrigger className="w-36 py-2 px-4 h-10 text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50 text-text-muted text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Activity Details</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                mockActivities.map((activity, index) => (
                  <motion.tr 
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-bg/40 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-text">{activity.title}</div>
                      <div className="text-xs text-text-light truncate max-w-[200px]">{activity.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {activity.categoryName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {formatDate(activity.date, "short")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-xs font-bold rounded-full",
                        activity.status === "Active" ? "bg-success/10 text-success" : "bg-text-light/10 text-text-light"
                      )}>
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost-primary" size="icon" shape="square">
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost-danger" size="icon" shape="square">
                          <Trash2 size={16} />
                        </Button>
                        <Button variant="ghost-muted" size="icon" shape="square">
                          <MoreHorizontal size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-text-muted">
          <div>Showing 3 of 42 activities</div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="xs" shape="square" noShadow normalCase className="font-medium">Previous</Button>
            <Button variant="primary" size="xs" shape="square" noShadow normalCase>1</Button>
            <Button variant="secondary" size="xs" shape="square" noShadow normalCase className="font-medium">2</Button>
            <Button variant="secondary" size="xs" shape="square" noShadow normalCase className="font-medium">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
