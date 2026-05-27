"use client";

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
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { performLogout } from "@/lib/api-helpers";
import { getProfile } from "@/features/auth/api";
import { UserResponse } from "@/features/auth/types";
import Image from "next/image";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const u = await getProfile();
        if (u) {
          setProfile(u);
        }
      } catch (err) {
        console.error("Failed to load user profile in layout:", err);
      }
    };
    fetchProfile();

    // Load collapse state from localStorage if available
    const saved = localStorage.getItem("citizen-sidebar-collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("citizen-sidebar-collapsed", String(nextState));
  };

  const handleLogout = () => performLogout('/member_login');

  const navItems = [
    { href: "/citizen", label: "Dashboard", icon: LayoutDashboard },
    { href: "/citizen/profile", label: "My Profile", icon: User },
    { href: "/citizen/donations", label: "My Donations", icon: Heart },
    { href: "/citizen/referrals", label: "My Referrals", icon: Share2 },
    { href: "/citizen/volunteer", label: "Volunteer Application", icon: Award },
    { href: "/citizen/support", label: "Support Tickets", icon: MessageSquare },
    { href: "/citizen/settings", label: "Privacy & Settings", icon: Settings },
  ];

  const userInitials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "SC";

  return (
    <div className="min-h-screen md:h-screen bg-bg flex flex-col md:flex-row md:overflow-hidden">
      
      {/* Mobile Header Bar */}
      <header className="md:hidden h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
        <Link href="/" className="flex flex-col">
          <span className="font-display font-black text-lg text-primary leading-none">GlobalSmart</span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted opacity-60">Citizen Portal</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-text hover:bg-bg rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </Button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside 
        className={cn(
          "fixed top-0 bottom-0 left-0 w-80 bg-white z-50 md:hidden flex flex-col transition-transform duration-300 ease-in-out border-r border-border",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile menu top */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/" className="flex flex-col" onClick={() => setIsMobileOpen(false)}>
            <span className="font-display font-black text-xl text-primary leading-none">GlobalSmart</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted opacity-60">Citizen Portal</span>
          </Link>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-text hover:bg-bg rounded-lg transition-colors"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Mobile user profile card */}
        <div className="p-6 border-b border-border bg-bg/30">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
              {profile?.profile_photo ? (
                <Image 
                  src={profile.profile_photo} 
                  alt={profile.name} 
                  fill 
                  sizes="48px"
                  className="object-cover" 
                />
              ) : (
                userInitials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-text truncate">{profile?.name || "Loading..."}</p>
              <p className="text-[11px] text-text-muted font-mono truncate">{profile?.referral_id || "SC-CITIZEN"}</p>
            </div>
          </div>
        </div>

        {/* Mobile Navigation links */}
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[14px] transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-text-muted hover:bg-bg hover:text-text"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Logout section */}
        <div className="p-6 border-t border-border bg-white mt-auto">
          <Button 
            variant="ghost-danger" 
            fullWidth 
            alignLeft 
            normalCase 
            className="gap-3 px-4 py-3 text-[14px]"
            onClick={handleLogout}
          >
            <LogOut size={18} className="shrink-0" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Desktop Sidebar Navigation */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-border shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out relative",
          isCollapsed ? "w-20" : "w-64 lg:w-72"
        )}
      >
        {/* Toggle Collapse Button */}
        <Button
          variant="secondary"
          size="icon"
          shape="circle"
          onClick={toggleCollapse}
          className="absolute -right-3 top-8 w-6 h-6 bg-white border border-border flex items-center justify-center text-text shadow-sm hover:bg-bg transition-colors z-20"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>

        {/* Desktop sidebar top logo */}
        <div className={cn("p-6 border-b border-border", isCollapsed ? "text-center" : "")}>
          <Link href="/" className="flex flex-col">
            {isCollapsed ? (
              <span className="font-display font-black text-xl text-primary leading-none">GS</span>
            ) : (
              <>
                <span className="font-display font-black text-xl text-primary leading-none">GlobalSmart</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted opacity-60 mt-0.5">Citizen Portal</span>
              </>
            )}
          </Link>
        </div>

        {/* Desktop user profile mini-card */}
        <div className={cn("p-4 border-b border-border bg-bg/25", isCollapsed ? "flex justify-center" : "")}>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
              {profile?.profile_photo ? (
                <Image 
                  src={profile.profile_photo} 
                  alt={profile.name} 
                  fill 
                  sizes="40px"
                  className="object-cover" 
                />
              ) : (
                userInitials
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[13px] text-text truncate">{profile?.name || "Loading..."}</p>
                <p className="text-[10px] text-text-muted font-mono truncate">{profile?.referral_id || "SC-MEMBER"}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop nav links */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-xl font-bold text-[14px] transition-all",
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "text-text-muted hover:bg-bg hover:text-text"
                )}
              >
                <Icon size={18} className="shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Desktop logout section */}
        <div className="p-4 border-t border-border bg-white mt-auto">
          <Button 
            variant="ghost-danger" 
            fullWidth={!isCollapsed} 
            alignLeft={!isCollapsed} 
            normalCase 
            className={cn("text-[14px] transition-all", isCollapsed ? "p-3 justify-center" : "gap-3 px-4 py-3")}
            onClick={handleLogout}
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            {!isCollapsed && <span>Log Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}
