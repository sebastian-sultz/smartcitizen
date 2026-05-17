"use client";

import React from "react";
import { MoreHorizontal, Edit, Trash2, Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { AwarenessActivity } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

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
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or category..." 
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="text-sm bg-bg border border-border rounded-xl px-3 py-2 outline-none">
              <option>All Categories</option>
              <option>Environment</option>
              <option>Health</option>
              <option>Education</option>
            </select>
            <select className="text-sm bg-bg border border-border rounded-xl px-3 py-2 outline-none">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
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
              {mockActivities.map((activity, index) => (
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
                    {new Date(activity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
              ))}
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
