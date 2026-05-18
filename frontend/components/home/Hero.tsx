"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#F9F8F6] overflow-hidden pt-24 pb-20 lg:pt-27 lg:pb-12">
      {/* Unique Abstract Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradients */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -left-[5%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px]"
        />

        {/* SVG Subtle Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating Organic Shapes */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 left-10 w-24 h-24 border border-primary/10 rounded-full hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-1/4 right-20 w-32 h-32 border border-accent/10 rounded-[40px] hidden lg:block"
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
              <Link
                href="/donation"
                className="group relative w-full sm:w-auto bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 active:scale-95 overflow-hidden"
              >
                <Heart size={18} fill="currentColor" />
                Support Mission
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                href="/JoinUs"
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-border hover:border-primary hover:text-primary text-text font-black flex items-center justify-center gap-2 transition-all active:scale-95 text-[15px]"
              >
                Become a Volunteer
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
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
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 relative w-full max-w-2xl"
          >
            <div className="relative aspect-[4/5] md:aspect-square rounded-[40px] md:rounded-[80px] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)]">
              <img
                src="/assets/vision34.jpeg"
                alt="Foundation Impact"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-40" />

              {/* Floating Success Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-8 left-8 right-8 p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl hidden sm:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text">Latest Milestone</h4>
                    <p className="text-sm text-text-muted">
                      1,000+ Students Educated this month
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Geometric Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent rounded-full -z-10 animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 border-8 border-primary/10 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
