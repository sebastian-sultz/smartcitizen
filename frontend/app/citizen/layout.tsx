"use client";
import { ASSETS } from "@/lib/assets";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Heart,
  Share2,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { performLogout } from "@/lib/api-helpers";
import { useCitizenStore } from "@/store/citizenStore";
import Image from "next/image";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { volunteer, fetchProfile } = useCitizenStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("citizen-sidebar-collapsed") === "true";
    }
    return false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("citizen-sidebar-collapsed", String(nextState));
  };

  const handleLogout = () => performLogout("/member_login");

  const navItems = [
    { href: "/citizen", label: "Dashboard", icon: LayoutDashboard },
    { href: "/citizen/profile", label: "My Profile", icon: User },
    { href: "/citizen/donations", label: "My Donations", icon: Heart },
    { href: "/citizen/referrals", label: "My Referrals", icon: Share2 },
    { href: "/citizen/volunteer", label: "Volunteer Application", icon: Award },
    { href: "/citizen/need_help", label: "Need Help", icon: HelpCircle },
    { href: "/citizen/support", label: "Help & Support", icon: MessageSquare },
    { href: "/citizen/settings", label: "Privacy & Settings", icon: Settings },
  ];

  const isVolunteer = !!volunteer;
  const filteredNavItems = navItems.filter((item) => {
    if (item.href === "/citizen/profile" || item.href === "/citizen/settings") {
      return isVolunteer;
    }
    return true;
  });

  return (
    <div className="min-h-screen md:h-screen bg-bg flex flex-col md:flex-row md:overflow-hidden">
      {/* Mobile Header Bar */}
      <header className="md:hidden h-14 bg-white/75 backdrop-blur-lg border-b border-black/[0.04] flex items-center justify-between px-4 sticky top-0 z-40 transition-all duration-200">
        <Link
          href="/citizen"
          className="flex items-center gap-2.5 active:opacity-80 transition-opacity"
        >
          <div className="relative w-8.5 h-8.5 shrink-0  overflow-hidden">
            <Image
              src={ASSETS.logo}
              alt="GlobalSmart Logo"
              fill
              sizes="32px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-[15px] tracking-tight text-primary leading-none">
              GlobalSmart
            </span>
            <span className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-text-muted/90 leading-none mt-1">
              Citizen Portal
            </span>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          shape="circle"
          onClick={() => setIsMobileOpen(true)}
          className="w-9 h-9 rounded-full bg-bg/50 border border-border/50 text-text hover:bg-bg transition-all active:scale-95 shadow-sm"
          aria-label="Open navigation menu"
        >
          <Menu size={16} className="text-text-light" />
        </Button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-80 bg-gradient-to-b from-white to-bg/40 z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out border-r border-border/60 shadow-xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Mobile menu top */}
        <div className="p-4 border-b border-border/40 flex items-center justify-between bg-white h-16 shrink-0">
          <Link
            href="/citizen"
            className="flex items-center gap-2.5"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden border border-primary/10 shadow-sm">
              <Image
                src={ASSETS.logo}
                alt="GlobalSmart Logo"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-[15px] tracking-tight text-primary leading-none">
                GlobalSmart
              </span>
              <span className="text-[7.5px] font-bold uppercase tracking-[0.18em] text-text-muted/90 leading-none mt-1">
                Citizen Portal
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            shape="circle"
            onClick={() => setIsMobileOpen(false)}
            className="w-9 h-9 rounded-full bg-bg/50 border border-border/50 text-text hover:bg-bg transition-all active:scale-95 shadow-sm"
            aria-label="Close navigation menu"
          >
            <X size={16} className="text-text-light" />
          </Button>
        </div>

        {/* Mobile Navigation links */}
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13.5px] transition-all relative overflow-hidden",
                  isActive
                    ? "bg-primary/[0.04] text-primary font-bold before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3.5px] before:bg-primary before:rounded-r-md"
                    : "text-text-light hover:bg-bg hover:text-text font-medium duration-200",
                )}
              >
                <Icon
                  size={17}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-primary" : "text-text-light/85",
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile bottom panel containing Logout */}
        <div className="p-4 border-t border-border/40 bg-white mt-auto shrink-0">
          <Button
            variant="ghost-danger"
            fullWidth
            alignLeft
            normalCase
            onClick={handleLogout}
            className="py-2.5 h-auto text-xs font-bold"
          >
            <LogOut size={18} className="shrink-0" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Desktop Sidebar Navigation */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-gradient-to-b from-white to-bg/40 border-r border-border/60 shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out relative shadow-[2px_0_8px_-4px_rgba(0,0,0,0.03)]",
          isCollapsed ? "w-20" : "w-64 lg:w-72",
        )}
      >
        {/* Toggle Collapse Button */}
        <Button
          variant="secondary"
          size="icon"
          shape="circle"
          onClick={toggleCollapse}
          className="absolute -right-3.5 top-8 w-7 h-7 bg-white border border-border/80 text-text/80 shadow-md hover:bg-bg-alt hover:text-primary transition-all z-20"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>

        {/* Desktop sidebar top logo */}
        <div
          className={cn(
            "pt-7 pb-5 px-6 border-b border-border/40",
            isCollapsed ? "flex justify-center" : "",
          )}
        >
          <Link href="/citizen" className="flex items-center gap-2">
            {isCollapsed ? (
              <div className="relative w-9 h-9 shrink-0 transition-all duration-300">
                <Image
                  src={ASSETS.logo}
                  alt="GlobalSmart Logo"
                  fill
                  sizes="36px"
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <>
                <div className="relative w-15 h-15 shrink-0 transition-all duration-300">
                  <Image
                    src={ASSETS.logo}
                    alt="GlobalSmart Logo"
                    fill
                    sizes="60px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col animate-fade-in">
                  <span className="font-display font-black text-xl text-primary leading-none">
                    GlobalSmart
                  </span>
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-text-muted opacity-60 mt-0.5">
                    Citizen Portal
                  </span>
                </div>
              </>
            )}
          </Link>
        </div>

        {/* Desktop nav links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-xl font-bold text-[14px] transition-all relative overflow-hidden",
                  isCollapsed
                    ? "justify-center p-3 my-1.5"
                    : "gap-3 px-4 py-3 my-1",
                  isActive
                    ? "bg-primary/[0.04] text-primary before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3.5px] before:bg-primary before:rounded-r-md"
                    : "text-text-light hover:bg-bg/60 hover:text-text duration-200",
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-text-light/85",
                  )}
                />
                {!isCollapsed && (
                  <span className="transition-all">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop bottom panel containing Logout */}
        <div
          className={cn(
            "p-4 border-t border-border/40 bg-gradient-to-t from-bg/25 to-white mt-auto",
            isCollapsed && "flex justify-center",
          )}
        >
          <Button
            variant="ghost-danger"
            fullWidth={!isCollapsed}
            alignLeft={!isCollapsed}
            normalCase
            size={isCollapsed ? "icon" : "md"}
            className="transition-all py-2.5 h-auto text-xs font-bold"
            onClick={handleLogout}
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span>Log Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto pb-8 md:pb-12">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
