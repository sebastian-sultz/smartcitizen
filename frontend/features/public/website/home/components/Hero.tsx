"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/store/authStore";

export function Hero() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <section className="relative min-h-screen flex items-center bg-bg overflow-hidden pt-24 pb-20 lg:pt-27 lg:pb-12">
      {/* Unique Abstract Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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

      <div className="max-content relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Side - Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[12px] font-black uppercase tracking-[0.2em]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Empowering India's Future
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="font-display text-5xl md:text-7xl xl:text-[80px] font-black text-text leading-[1.05] tracking-tight">
                Building a <span className="text-primary italic">Smarter</span>{" "}
                & Safer Society.
              </h1>
              <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                GlobalSmart Citizens Foundation is a dedicated non-profit
                working at the grassroots to create awareness, provide guidance,
                and uplift every citizen through education and social ethics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Button
                asChild
                variant="primary"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 active:scale-95 overflow-hidden h-auto"
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
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-border hover:border-primary hover:text-primary text-text font-black active:scale-95 text-[15px] h-auto"
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
            </motion.div>

            {/* Impact Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8 border-t border-border"
            >
              {[
                { label: "Lives Impacted", val: "50,000+" },
                { label: "Districts Reached", val: "12+" },
                { label: "Active Volunteers", val: "5,000+" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl font-black text-text">
                    {stat.val}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-text-light">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side - Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative w-full max-w-2xl"
          >
            {/* Floating Become Smart Citizen Card - One-time entrance animation */}
            {!isLoggedIn && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -top-12 -left-20 md:-left-32 lg:-left-40 z-20 max-w-[290px] hidden sm:block"
              >
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
                      className="w-full relative overflow-hidden bg-primary hover:bg-primary-light text-white font-black rounded-2xl py-3 px-4 shadow-lg shadow-primary/15 transition-all duration-300 group/btn text-xs h-auto"
                    >
                      <Link
                        href="/register"
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
              </motion.div>
            )}

            {/* Floating Success Card - One-time entrance animation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-6 -right-6 md:-right-12 z-20 max-w-[280px] hidden sm:block"
            >
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
            </motion.div>

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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
