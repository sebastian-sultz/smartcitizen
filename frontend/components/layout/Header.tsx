"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Heart, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const aboutLinks = [
  { name: "About the Foundation", href: "/about" },
  { name: "Mission & Vision", href: "/mission" },
  { name: "Our Social Impact", href: "/impact" },
  { name: "Legal Documents", href: "/legal_documents" },
];

const activityLinks = [
  { name: "Our Initiatives", href: "/initiatives" },
  { name: "Our Programs", href: "/our_work" },
  { name: "Upcoming Events", href: "/events" },
];

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const userType = useAuthStore((state) => state.userType);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "top-0 py-2" : "top-10 py-4",
      )}
    >
      <div className="max-content">
        <div
          className={cn(
            "relative flex items-center justify-between px-4 md:px-6 py-2 md:py-3 rounded-[20px] md:rounded-[24px] transition-all duration-500 border",
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-2xl border-primary/10"
              : isHome
                ? "bg-primary/5 backdrop-blur-sm border-primary/10 text-text"
                : "bg-primary/10 backdrop-blur-sm border-white/20 text-white",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3 group relative z-10"
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10">
              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <Image
                src="/assets/logo.png"
                alt="GlobalSmart Logo"
                fill
                priority
                sizes="(max-width: 768px) 32px, 40px"
                className="object-contain relative z-10"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-display text-2xl font-black leading-none transition-colors",
                  isScrolled || isHome ? "text-primary" : "text-white",
                )}
              >
                GlobalSmart
              </span>
              <span
                className={cn(
                  "font-body text-[10px] uppercase tracking-[0.2em] font-bold opacity-70",
                  isScrolled || isHome ? "text-text-muted" : "text-white/80",
                )}
              >
                Citizens Foundation
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "px-4 py-2 rounded-full font-bold text-[14px] transition-all hover:bg-primary/5",
                isScrolled || isHome
                  ? "text-text hover:text-primary"
                  : "text-white hover:bg-white/10",
              )}
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("about")}
              onMouseLeave={() => setActiveDropdown(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setActiveDropdown(null);
                }
              }}
            >
              <Button
                variant="ghost"
                id="about-nav-trigger"
                aria-haspopup="menu"
                aria-expanded={activeDropdown === "about"}
                onClick={() =>
                  setActiveDropdown((prev) =>
                    prev === "about" ? null : "about",
                  )
                }
                className={cn(
                  "px-4 py-2 rounded-full font-bold text-[14px] flex items-center gap-1 transition-all hover:bg-primary/5",
                  isScrolled || isHome
                    ? "text-text hover:text-primary"
                    : "text-white hover:bg-white/10",
                )}
              >
                About{" "}
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-300",
                    activeDropdown === "about" && "rotate-180",
                  )}
                />
              </Button>
                {activeDropdown === "about" && (
                  <div className="absolute top-full left-0 pt-2 w-72 z-50">
                    <div
                      role="menu"
                      aria-labelledby="about-nav-trigger"
                      className="animate-dropdown bg-white rounded-3xl shadow-2xl py-4 text-text border border-primary/5 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 p-2 gap-1">
                        {aboutLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            role="menuitem"
                            onClick={() => setActiveDropdown(null)}
                            className="px-6 py-3 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all text-[14px] font-medium flex items-center justify-between group"
                          >
                            {link.name}
                            <ChevronDown
                              size={14}
                              className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("activity")}
              onMouseLeave={() => setActiveDropdown(null)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setActiveDropdown(null);
                }
              }}
            >
              <Button
                variant="ghost"
                id="activity-nav-trigger"
                aria-haspopup="menu"
                aria-expanded={activeDropdown === "activity"}
                onClick={() =>
                  setActiveDropdown((prev) =>
                    prev === "activity" ? null : "activity",
                  )
                }
                className={cn(
                  "px-4 py-2 rounded-full font-bold text-[14px] flex items-center gap-1 transition-all hover:bg-primary/5",
                  isScrolled || isHome
                    ? "text-text hover:text-primary"
                    : "text-white hover:bg-white/10",
                )}
              >
                Activity{" "}
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-300",
                    activeDropdown === "activity" && "rotate-180",
                  )}
                />
              </Button>
                {activeDropdown === "activity" && (
                  <div className="absolute top-full left-0 pt-2 w-72 z-50">
                    <div
                      role="menu"
                      aria-labelledby="activity-nav-trigger"
                      className="animate-dropdown bg-white rounded-3xl shadow-2xl py-4 text-text border border-primary/5 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 p-2 gap-1">
                        {activityLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            role="menuitem"
                            onClick={() => setActiveDropdown(null)}
                            className="px-6 py-3 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all text-[14px] font-medium flex items-center justify-between group"
                          >
                            {link.name}
                            <ChevronDown
                              size={14}
                              className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            <Link
              href="/need_help"
              className={cn(
                "px-4 py-2 rounded-full font-bold text-[14px] transition-all hover:bg-primary/5 flex items-center gap-2",
                isScrolled || isHome
                  ? "text-text hover:text-primary"
                  : "text-white hover:bg-white/10",
              )}
            >
              Need Help?
            </Link>
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {!isInitialized ? (
              <Skeleton className="h-10 w-24 rounded-full" />
            ) : isLoggedIn ? (
              <Button
                asChild
                variant="outline"
                shape="pill"
                className={cn(
                  "px-5 py-2.5 text-[14px] border-2 font-bold transition-all h-auto",
                  isScrolled || isHome
                    ? "border-primary/20 text-primary hover:bg-primary hover:text-white"
                    : "border-white/30 text-white hover:bg-white hover:text-primary",
                )}
              >
                <Link
                  href={userType === "admin" ? "/admin" : "/citizen"}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                shape="pill"
                className={cn(
                  "px-5 py-2.5 text-[14px] border-2 font-bold transition-all h-auto",
                  isScrolled || isHome
                    ? "border-primary/20 text-primary hover:bg-primary hover:text-white"
                    : "border-white/30 text-white hover:bg-white hover:text-primary",
                )}
              >
                <Link href="/member_login" className="flex items-center gap-2">
                  <LogIn size={16} />
                  Sign In
                </Link>
              </Button>
            )}
            <Button
              asChild
              variant="accent"
              shape="pill"
              className="px-6 py-2.5 text-[14px] font-bold shadow-xl shadow-accent/20 active:scale-95 h-auto"
            >
              <Link href="/donation" className="flex items-center gap-2">
                <Heart size={16} fill="currentColor" />
                Support
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden p-3 rounded-full transition-all active:scale-90",
              isScrolled || isHome
                ? "bg-primary/5 text-primary"
                : "bg-white/10 text-white",
            )}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="animate-fade-in fixed inset-0 bg-dark/90 backdrop-blur-md z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="animate-slide-in-right fixed top-4 right-4 bottom-4 w-[320px] bg-white rounded-[40px] z-[60] lg:hidden overflow-hidden flex flex-col shadow-2xl shadow-black/50"
          >
              <div className="p-8 flex items-center justify-between bg-bg border-b border-border">
                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl text-primary leading-none">
                    GlobalSmart
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-60">
                    Foundation
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-text hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </Button>
              </div>

              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                <nav className="space-y-8">
                  <div
                    style={{ animationDelay: "100ms" }}
                    className="animate-fade-in-right-fast"
                  >
                    <Link
                      href="/"
                      className="flex items-center justify-between p-4 rounded-2xl bg-bg text-lg font-bold text-text hover:text-primary transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Home
                      <ChevronDown size={18} className="-rotate-90" />
                    </Link>
                  </div>

                  <div
                    style={{ animationDelay: "150ms" }}
                    className="animate-fade-in-right-fast space-y-4"
                  >
                    <span className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                      About Us
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {aboutLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="px-4 py-3 rounded-xl hover:bg-bg text-[15px] text-text-muted hover:text-primary flex items-center justify-between group"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                          <ChevronDown
                            size={14}
                            className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{ animationDelay: "200ms" }}
                    className="animate-fade-in-right-fast space-y-4"
                  >
                    <span className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                      Our Activities
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {activityLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="px-4 py-3 rounded-xl hover:bg-bg text-[15px] text-text-muted hover:text-primary flex items-center justify-between group"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                          <ChevronDown
                            size={14}
                            className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>

              <div className="p-8 bg-bg border-t border-border space-y-4">
                <Button
                  asChild
                  variant="accent"
                  className="w-full py-3.5 rounded-2xl font-bold text-[14px] shadow-lg shadow-accent/20 h-auto"
                >
                  <Link
                    href="/donation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2"
                  >
                    <Heart size={16} fill="currentColor" />
                    Support Our Mission
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  {!isInitialized ? (
                    <>
                      <Skeleton className="h-12 w-full rounded-2xl" />
                      <Skeleton className="h-12 w-full rounded-2xl" />
                    </>
                  ) : isLoggedIn ? (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="py-3.5 rounded-2xl font-bold text-[14px] h-auto border-2"
                      >
                        <Link
                          href={userType === "admin" ? "/admin" : "/citizen"}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="primary"
                        className="py-3.5 rounded-2xl font-bold text-[14px] shadow-lg shadow-primary/20 h-auto"
                      >
                        <Link
                          href="/need_help"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Get Help
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="py-3.5 rounded-2xl font-bold text-[14px] h-auto border-2"
                      >
                        <Link
                          href="/member_login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2"
                        >
                          <LogIn size={16} />
                          Sign In
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="primary"
                        className="py-3.5 rounded-2xl font-bold text-[14px] shadow-lg shadow-primary/20 h-auto"
                      >
                        <Link
                          href="/need_help"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Get Help
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
          </div>
        </>
      )}
    </header>
  );
}
