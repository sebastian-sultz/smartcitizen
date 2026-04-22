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
        "fixed top-10 left-0 right-0 z-40 transition-all duration-300",
        isScrolled 
          ? "top-0 bg-white shadow-md py-3 text-text" 
          : "bg-transparent py-5 text-white"
      )}
    >
      <div className="max-content flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/assets/logo.png" alt="GlobalSmart Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <span className="font-display text-2xl font-black leading-none group-hover:text-accent transition-colors">
              GlobalSmart
            </span>
            <span className="font-body text-[11px] uppercase tracking-widest font-light opacity-80">
              Citizens Foundation
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="font-semibold hover:text-accent transition-colors">Home</Link>
          
          <div 
            className="relative group"
            onMouseEnter={() => setActiveDropdown('about')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 font-semibold hover:text-accent transition-colors">
              About <ChevronDown size={14} className={cn("transition-transform", activeDropdown === 'about' && "rotate-180")} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'about' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-4 text-text border border-border"
                >
                  {aboutLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className="block px-6 py-2 hover:bg-bg hover:text-primary transition-colors text-[15px]"
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div 
            className="relative group"
            onMouseEnter={() => setActiveDropdown('activity')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 font-semibold hover:text-accent transition-colors">
              Activity <ChevronDown size={14} className={cn("transition-transform", activeDropdown === 'activity' && "rotate-180")} />
            </button>
            <AnimatePresence>
              {activeDropdown === 'activity' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-4 text-text border border-border"
                >
                  {activityLinks.map((link) => (
                    <Link 
                      key={link.href} 
                      href={link.href}
                      className="block px-6 py-2 hover:bg-bg hover:text-primary transition-colors text-[15px]"
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/ContactUs" className="font-semibold hover:text-accent transition-colors">Get Help</Link>
        </nav>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            href="/JoinUs" 
            className={cn(
              "px-6 py-2.5 rounded-lg font-semibold border-2 transition-all text-[15px]",
              isScrolled ? "border-primary text-primary hover:bg-primary hover:text-white" : "border-white text-white hover:bg-white hover:text-primary"
            )}
          >
            Join as Volunteer
          </Link>
          <Link 
            href="/donation" 
            className="bg-accent hover:bg-accent-light text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all text-[15px] shadow-lg shadow-accent/20"
          >
            <Heart size={16} fill="currentColor" />
            Support the Cause
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[60] lg:hidden overflow-y-auto flex flex-col"
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <span className="font-display font-bold text-xl text-primary">GlobalSmart</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-text">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-6">
                <Link href="/" className="block text-lg font-semibold border-b border-border pb-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                
                <div className="space-y-3">
                  <span className="block text-[12px] uppercase tracking-widest text-text-light font-bold">About Us</span>
                  {aboutLinks.map(link => (
                    <Link key={link.href} href={link.href} className="block text-[15px] text-text hover:text-primary pl-2" onClick={() => setMobileMenuOpen(false)}>
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="space-y-3">
                  <span className="block text-[12px] uppercase tracking-widest text-text-light font-bold">Our Activities</span>
                  {activityLinks.map(link => (
                    <Link key={link.href} href={link.href} className="block text-[15px] text-text hover:text-primary pl-2" onClick={() => setMobileMenuOpen(false)}>
                      {link.name}
                    </Link>
                  ))}
                </div>

                <Link href="/ContactUs" className="block text-lg font-semibold border-t border-border pt-4" onClick={() => setMobileMenuOpen(false)}>Get Help</Link>
              </div>

              <div className="p-6 border-t border-border space-y-4 bg-bg">
                <Link href="/JoinUs" className="block w-full bg-primary text-white text-center py-3 rounded-lg font-bold" onClick={() => setMobileMenuOpen(false)}>
                  Join as Volunteer
                </Link>
                <Link href="/donation" className="block w-full bg-accent text-white text-center py-3 rounded-lg font-bold" onClick={() => setMobileMenuOpen(false)}>
                  Support the Cause
                </Link>
                <div className="text-[13px] text-text-muted space-y-1 pt-2">
                  <p>📞 84 29 69 69 69</p>
                  <p className="truncate">✉ globalsmartcitizensfoundation@gmail.com</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
