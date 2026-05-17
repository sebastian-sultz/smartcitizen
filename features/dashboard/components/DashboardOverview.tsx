"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Heart, Megaphone, ArrowUpRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/features/admin/store/useAdminStore";

export function DashboardOverview() {
  const { users, volunteerApps, events, campaigns } = useAdminStore();

  const activeUsersCount = users.filter(u => u.status === 'Active').length;
  const activeVolunteersCount = users.filter(u => u.role === 'Volunteer' || u.role === 'Coordinator').length;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'Active').length;

  const stats = [
    {
      title: "Total Smart Citizens",
      value: activeUsersCount.toString(),
      change: "+12%",
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Active Volunteers",
      value: activeVolunteersCount.toString(),
      change: "+5%",
      icon: <UserCheck className="w-6 h-6" />,
      color: "bg-teal-600",
    },
    {
      title: "Total Donations",
      value: "₹ 4,25,000",
      change: "+18%",
      icon: <Heart className="w-6 h-6" />,
      color: "bg-accent",
    },
    {
      title: "Active Campaigns",
      value: activeCampaignsCount.toString(),
      change: "+2%",
      icon: <Megaphone className="w-6 h-6" />,
      color: "bg-orange-500",
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text">Dashboard Overview</h2>
        <p className="text-text-muted">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface p-6 rounded-2xl shadow-card border border-border relative overflow-hidden group"
          >
            <div className={cn(
              "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-125",
              stat.color
            )} />
            
            <div className="flex justify-between items-start mb-4">
               <div className={cn("p-3 rounded-xl text-white shadow-lg", stat.color)}>
                {stat.icon}
              </div>
              <span className="flex items-center text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={14} className="mr-1" />
                {stat.change}
              </span>
            </div>

            <h3 className="text-text-muted text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for Charts/Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center">
              <TrendingUp className="mr-2 text-primary" size={20} />
              Recent Engagement Trends
            </h3>
            <select className="text-xs bg-bg border border-border rounded-md px-2 py-1">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-xl text-text-light italic">
            Visual analytics charts will be implemented here.
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-card border border-border">
          <h3 className="font-bold text-lg mb-6">Recent Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-bg transition-colors cursor-pointer">
                <div className="w-2 h-2 mt-2 bg-accent rounded-full shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text">New Volunteer Registration Pending</p>
                  <p className="text-xs text-text-light">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm font-semibold text-primary hover:underline">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
