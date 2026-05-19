import React from "react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Header } from "@/features/dashboard/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 lg:ml-72 transition-all">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        <footer className="p-6 text-center text-xs text-text-light lg:ml-72 transition-all">
          &copy; {new Date().getFullYear()} Global Smart Citizens Foundation. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
