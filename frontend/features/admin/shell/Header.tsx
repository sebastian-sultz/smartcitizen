"use client";

import React from "react";
import { Search, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Header() {
  const pathname = usePathname();
  
  // Convert pathname to breadcrumbs (e.g. /dashboard/awareness/category -> Dashboard / Awareness / Category)
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map(s => s.charAt(0).toUpperCase() + s.slice(1).replace("-", " "));

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between pl-16 pr-6 py-4 lg:px-6 bg-surface/80 backdrop-blur-md border-b border-border ml-0 lg:ml-72 transition-all">
      <div className="flex items-center">
        {/* Mobile Page Title */}
        <div className="lg:hidden text-sm font-bold text-primary">
          {breadcrumbs[breadcrumbs.length - 1] || "Dashboard"}
        </div>

        {/* Desktop Breadcrumbs */}
        <div className="hidden lg:flex items-center space-x-2 text-sm text-text-muted">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb}>
              <span className={index === breadcrumbs.length - 1 ? "text-primary font-semibold" : ""}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && <span className="mx-1">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="hidden md:block w-56">
          <Input 
            type="text" 
            placeholder="Search activities..." 
            icon={<Search size={18} />}
            size="sm"
            shape="pill"
          />
        </div>



        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-border">
          <div className="hidden text-right lg:block">
            <p className="text-sm font-semibold text-text">Administrator</p>
            <p className="text-xs text-text-muted">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
