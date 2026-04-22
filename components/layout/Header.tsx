"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const aboutLinks = [
  { name: "About the Foundation", href: "/About" },
  { name: "Mission & Vision", href: "/mission" },
  { name: "Our Social Impact", href: "/impact" },
  { name: "Our Partners & Experts", href: "/partner" },
  { name: "Awareness Quiz", href: "/playquize" },
  { name: "Participation Highlights", href: "/leaderboard" },
  { name: "Legal Documents", href: "/Legal_Documents" },
];

const activityLinks = [
  { name: "Awareness Blogs", href: "/blogs" },
  { name: "Community Activities", href: "/volunteractivity" },
  { name: "Our Programs", href: "/ourwork" },
  { name: "Our Activities", href: "/ouractivity" },
  { name: "Upcoming Programs", href: "/events" },
  { name: "Volunteer Programs", href: "/volunteer" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "top-0 py-2" : "top-12 py-4"
      )}
    >
      <div className="max-content">
        <div 
          className={cn(
            "relative flex items-center justify-between px-6 py-3 rounded-[24px] transition-all duration-500 border",
            isScrolled 
              ? "bg-white/90 backdrop-blur-md shadow-2xl border-primary/10" 
              : "bg-primary/10 backdrop-blur-sm border-white/20 text-white"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <img src="/assets/logo.png" alt="GlobalSmart Logo" className="h-10 w-auto relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-display text-2xl font-black leading-none transition-colors",
                isScrolled ? "text-primary" : "text-white"
              )}>
                GlobalSmart
              </span>
              <span className={cn(
                "font-body text-[10px] uppercase tracking-[0.2em] font-bold opacity-70",
                isScrolled ? "text-text-muted" : "text-white/80"
              )}>
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
                isScrolled ? "text-text hover:text-primary" : "text-white hover:bg-white/10"
              )}
            >
              Home
            </Link>
            
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={cn(
                "px-4 py-2 rounded-full font-bold text-[14px] flex items-center gap-1 transition-all hover:bg-primary/5",
                isScrolled ? "text-text hover:text-primary" : "text-white hover:bg-white/10"
              )}>
                About <ChevronDown size={14} className={cn("transition-transform duration-300", activeDropdown === 'about' && "rotate-180")} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'about' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl py-4 text-text border border-primary/5 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 p-2 gap-1">
                      {aboutLinks.map((link) => (
                        <Link 
                          key={link.href} 
                          href={link.href}
                          className="px-6 py-3 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all text-[14px] font-medium flex items-center justify-between group"
                        >
                          {link.name}
                          <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('activity')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={cn(
                "px-4 py-2 rounded-full font-bold text-[14px] flex items-center gap-1 transition-all hover:bg-primary/5",
                isScrolled ? "text-text hover:text-primary" : "text-white hover:bg-white/10"
              )}>
                Activity <ChevronDown size={14} className={cn("transition-transform duration-300", activeDropdown === 'activity' && "rotate-180")} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'activity' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl py-4 text-text border border-primary/5 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 p-2 gap-1">
                      {activityLinks.map((link) => (
                        <Link 
                          key={link.href} 
                          href={link.href}
                          className="px-6 py-3 hover:bg-primary/5 hover:text-primary rounded-2xl transition-all text-[14px] font-medium flex items-center justify-between group"
                        >
                          {link.name}
                          <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/ContactUs" 
              className={cn(
                "px-4 py-2 rounded-full font-bold text-[14px] transition-all hover:bg-primary/5",
                isScrolled ? "text-text hover:text-primary" : "text-white hover:bg-white/10"
              )}
            >
              Get Help
            </Link>
          </nav>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/JoinUs" 
              className={cn(
                "px-6 py-2.5 rounded-full font-bold transition-all text-[14px] border-2",
                isScrolled 
                  ? "border-primary/20 text-primary hover:bg-primary hover:text-white" 
                  : "border-white/30 text-white hover:bg-white hover:text-primary"
              )}
            >
              Join Us
            </Link>
            <Link 
              href="/donation" 
              className="bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all text-[14px] shadow-xl shadow-accent/20 active:scale-95"
            >
              <Heart size={16} fill="currentColor" />
              Support
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={cn(
              "lg:hidden p-3 rounded-full transition-all active:scale-90",
              isScrolled ? "bg-primary/5 text-primary" : "bg-white/10 text-white"
            )}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/90 backdrop-blur-md z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-4 right-4 bottom-4 w-[320px] bg-white rounded-[40px] z-[60] lg:hidden overflow-hidden flex flex-col shadow-2xl shadow-black/50"
            >
              <div className="p-8 flex items-center justify-between bg-bg border-b border-border">
                <div className="flex flex-col">
                  <span className="font-display font-black text-2xl text-primary leading-none">GlobalSmart</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-60">Foundation</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-text hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-8">
                <nav className="space-y-2">
                  <Link href="/" className="flex items-center justify-between p-4 rounded-2xl bg-bg text-lg font-bold text-text hover:text-primary transition-all" onClick={() => setMobileMenuOpen(false)}>
                    Home
                    <ChevronDown size={18} className="-rotate-90" />
                  </Link>
                  
                  <div className="space-y-4 pt-4">
                    <span className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-accent">About Us</span>
                    <div className="grid grid-cols-1 gap-1">
                      {aboutLinks.map(link => (
                        <Link key={link.href} href={link.href} className="px-4 py-3 rounded-xl hover:bg-bg text-[15px] text-text-muted hover:text-primary flex items-center justify-between group" onClick={() => setMobileMenuOpen(false)}>
                          {link.name}
                          <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <span className="px-4 text-[11px] font-black uppercase tracking-[0.2em] text-accent">Our Activities</span>
                    <div className="grid grid-cols-1 gap-1">
                      {activityLinks.map(link => (
                        <Link key={link.href} href={link.href} className="px-4 py-3 rounded-xl hover:bg-bg text-[15px] text-text-muted hover:text-primary flex items-center justify-between group" onClick={() => setMobileMenuOpen(false)}>
                          {link.name}
                          <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>

              <div className="p-8 bg-bg border-t border-border space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/JoinUs" className="bg-primary text-white text-center py-4 rounded-2xl font-bold text-[14px] shadow-lg shadow-primary/20" onClick={() => setMobileMenuOpen(false)}>
                    Join Us
                  </Link>
                  <Link href="/donation" className="bg-accent text-white text-center py-4 rounded-2xl font-bold text-[14px] shadow-lg shadow-accent/20" onClick={() => setMobileMenuOpen(false)}>
                    Support
                  </Link>
                </div>
                <Link href="/ContactUs" className="block w-full text-center py-4 rounded-2xl border-2 border-primary text-primary font-bold text-[14px]" onClick={() => setMobileMenuOpen(false)}>
                  Get Help
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
