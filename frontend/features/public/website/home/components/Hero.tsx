"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/store/authStore";

export function Hero() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return (
    <section className="relative min-h-[calc(100dvh-40px)] md:min-h-screen flex items-center bg-bg overflow-x-hidden md:overflow-hidden pt-20 pb-4 md:pt-24 md:pb-20 lg:pt-27 lg:pb-12">
      {/* 1. IMMERSIVE MOBILE BACKGROUND IMAGE (hidden on desktop) */}
      <div className="absolute inset-0 z-0 md:hidden overflow-hidden pointer-events-none">
        <Image
          src="/assets/vision34.jpeg"
          alt="Foundation Background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Soft, deep custom gradient wash overlay for maximum text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-[#0D0D0D]/95" />
      </div>

      {/* 2. UNIQUE DESKTOP ABSTRACT BACKGROUND (hidden on mobile) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden md:block">
        {/* Static Mesh Gradients - High Performance (No continuously running filters) */}
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px]" />

        {/* SVG Subtle Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ========================================== */}
      {/* 3. DESKTOP VIEW BRANCH (>= 768px / md and up) */}
      {/* ========================================== */}
      <div className="max-content relative z-10 hidden md:block w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Side - Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="animate-fade-in-right inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[12px] font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Empowering India&apos;s Future
            </div>

            <div className="animate-fade-in-up-delay-1 space-y-6">
              <h1 className="font-display text-5xl md:text-7xl xl:text-[80px] font-black text-text leading-[1.05] tracking-tight">
                Building a <span className="text-primary italic">Smarter</span>{" "}
                & Safer Society.
              </h1>
              <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                GlobalSmart Citizens Foundation is a dedicated non-profit
                working at the grassroots to create awareness, provide guidance,
                and uplift every citizen through education and social ethics.
              </p>
            </div>

            <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button
                asChild
                variant="primary"
                size="lg"
                fullWidth
                className="sm:w-auto overflow-hidden"
              >
                <Link
                  href="/donation"
                  className="group relative flex items-center justify-center gap-3"
                >
                  <Heart size={18} fill="currentColor" />
                  Support Mission
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                fullWidth
                className="sm:w-auto"
              >
                <Link
                  href="/need_help"
                  className="group flex items-center justify-center gap-2"
                >
                  Need Help
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Visuals */}
          <div className="animate-scale-in flex-1 relative w-full max-w-2xl">
            {/* Floating Become Smart Citizen Card - One-time entrance animation */}
            {isInitialized && !isLoggedIn && (
              <div className="animate-fade-in-right-delay-1 absolute -top-12 -left-20 md:-left-32 lg:-left-40 z-20 max-w-[290px] hidden sm:block">
                <Card className="bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl p-5 rounded-3xl relative overflow-hidden group hover:shadow-primary/20 hover:border-primary/20 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-primary/10 to-primary-light/5 rounded-full blur-2xl -z-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/5 shadow-inner">
                        <Heart
                          size={18}
                          fill="currentColor"
                          className="animate-pulse"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-accent">
                            Join the movement
                          </span>
                        </div>
                        <h4 className="font-display font-black text-text text-sm md:text-base leading-tight">
                          Make a Real Difference
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[11px] text-text-muted leading-relaxed">
                        Be the change you want to see. Start contributing to
                        your community today.
                      </p>

                      {/* Small Volunteer Facepile inside Card */}
                      <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {["a17.jpeg", "a18.jpeg", "a23.jpeg"].map(
                            (src, idx) => (
                              <div
                                key={idx}
                                className="inline-block h-5 w-5 rounded-full ring-2 ring-white overflow-hidden relative shrink-0"
                              >
                                <Image
                                  src={`/assets/${src}`}
                                  alt="Citizen avatar"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ),
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-text-light">
                          Joined by{" "}
                          <span className="text-primary font-black">
                            5,000+ citizens
                          </span>
                        </span>
                      </div>
                    </div>

                    <Button
                      asChild
                      variant="primary"
                      size="md"
                      fullWidth
                      className="relative overflow-hidden group/btn"
                    >
                      <Link
                        href="/join_us"
                        className="flex items-center justify-between gap-2"
                      >
                        <span>Become Smart Citizen</span>
                        <ArrowUpRight
                          size={14}
                          className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                        />
                      </Link>
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* Floating Success Card - One-time entrance animation */}
            <div className="animate-fade-in-left-delay-2 absolute -bottom-6 -right-6 md:-right-12 z-20 max-w-[280px] hidden sm:block">
              <Card className="bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl p-5 rounded-3xl relative overflow-hidden group hover:shadow-accent/30 transition-all duration-300">
                <div className="absolute top-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -z-10 group-hover:bg-accent/20 transition-all duration-500" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white shadow-lg shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-text text-base leading-tight">
                      Latest Milestone
                    </h4>
                    <p className="text-[11px] text-text-muted leading-tight mt-1">
                      1,000+ Students Educated this month
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="relative aspect-[4/5] md:aspect-square rounded-[40px] md:rounded-[80px] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)]">
              <Image
                src="/assets/vision34.jpeg"
                alt="Foundation Impact"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-40" />
            </div>

            {/* Decorative Geometric Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent rounded-full -z-10" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 border-8 border-primary/10 rounded-full -z-10" />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 4. MOBILE VIEW BRANCH (< 768px / md and down) */}
      {/* ========================================== */}
      <div className="relative z-10 flex md:hidden flex-col justify-between min-h-[calc(100dvh-40px-96px)] w-full px-4 gap-6 pt-4">
        {/* UPPER FOLD: Headline & Description */}
        <div className="animate-fade-in-up space-y-4 ">
          <div className="flex flex-col items-center gap-4">
            <Badge
              variant="outline"
              className="px-3.5 py-1 text-[10px] border-white/20 bg-white/10 text-white font-black uppercase tracking-[0.2em] h-auto rounded-full w-fit"
            >
              Empowering India
            </Badge>

            <h1 className="font-display text-center text-3xl font-black text-white leading-tight tracking-tight">
              Building a <span className="text-accent italic">Smarter</span>{" "}&
              Safer Society.
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
            GlobalSmart Citizens Foundation is a dedicated non-profit working at
            the grassroots to create awareness, provide guidance, and uplift
            every citizen through education and social ethics.
          </p>
        </div>

        {/* MIDDLE FOLD: Transparent Blurred Card UI (Just below the text) */}
        <div className="animate-fade-in-up-delay-1 w-full">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-5 rounded-3xl relative overflow-hidden text-white">
            {/* Ambient accent background light inside card */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/25 rounded-full blur-xl -z-10" />

            <div className="space-y-4 flex flex-col items-center justify-center">
              {/* Join Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-[10px] font-black uppercase tracking-[0.15em] w-fit">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                </span>
                Join the movement
              </div>

              <h3 className="font-display text-center font-black text-white text-lg leading-snug">
                Become a Smart Citizen & Build a Safer, Smarter India
              </h3>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <Button
                  asChild
                  variant="accent"
                  size="md"
                  fullWidth
                  className="shadow-lg shadow-accent/30 text-white font-black uppercase tracking-wide transition-all active:scale-95"
                >
                  <Link
                    href="/join_us"
                    className="flex items-center justify-between gap-2 w-full"
                  >
                    <span>Become Smart Citizen</span>
                    <ArrowUpRight size={16} />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost-white"
                  size="md"
                  fullWidth
                  className="border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition-all active:scale-95"
                >
                  <Link
                    href="/need_help"
                    className="flex items-center justify-center gap-2 w-full"
                  >
                    <span>Need Help?</span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>

              {/* Social proof pile inside Card */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {["a17.jpeg", "a18.jpeg", "a23.jpeg"].map((src, idx) => (
                    <div
                      key={idx}
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-white/10 overflow-hidden relative shrink-0"
                    >
                      <Image
                        src={`/assets/${src}`}
                        alt="Citizen avatar"
                        fill
                        sizes="20px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-white/80">
                  Joined by{" "}
                  <span className="text-accent-light font-black">
                    5,000+ citizens
                  </span>
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* BOTTOM FOLD: Milestone and Support link */}
        <div className="animate-fade-in-up-delay-2 flex items-center justify-between pt-3 border-t border-white/10 mt-auto pb-4">
          <div className="flex items-center gap-1.5 text-[10px] text-accent-light font-bold">
            <CheckCircle2 size={12} className="text-accent" />
            <span>1,000+ Students Educated this month</span>
          </div>

          <Link
            href="/donation"
            className="text-[11px] text-white hover:text-accent-light transition-colors underline font-bold flex items-center gap-0.5 shrink-0"
          >
            <span>Support Mission</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  );
}


