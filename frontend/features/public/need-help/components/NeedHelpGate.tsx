"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Users,
  ShieldCheck,
  ArrowRight,
  Heart,
  Scale,
  Stethoscope,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

import { ASSETS } from "@/lib/assets";

const professionsPreview = [
  { icon: Scale, label: "Legal Guidance", color: "bg-blue-50 text-blue-600" },
  { icon: Stethoscope, label: "Health Support", color: "bg-green-50 text-green-600" },
  { icon: BookOpen, label: "Education Aid", color: "bg-orange-50 text-orange-600" },
  { icon: Heart, label: "Social Welfare", color: "bg-red-50 text-red-600" },
];

const FAKE_CARDS = [
  { name: "Rajesh K.", role: "Legal Advisor", location: "New Delhi" },
  { name: "Priya S.", role: "Health Counselor", location: "Mumbai" },
  { name: "Arjun M.", role: "Social Worker", location: "Bangalore" },
  { name: "Sunita D.", role: "Financial Guide", location: "Chennai" },
  { name: "Vikram P.", role: "IT Volunteer", location: "Hyderabad" },
  { name: "Meena R.", role: "Legal Advisor", location: "Pune" },
];

export function NeedHelpGate() {
  return (
    <div className="relative w-full min-h-[600px]">
      {/* Blurred Background Preview of volunteer cards */}
      <div
        className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pointer-events-none select-none"
        aria-hidden="true"
      >
        {FAKE_CARDS.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-border shadow-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                <span className="font-display font-bold text-xl">
                  {card.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="h-5 bg-zinc-200 rounded-md w-3/4 mb-2" />
                <div className="h-3.5 bg-zinc-100 rounded-md w-1/2 mb-2" />
                <div className="h-3 bg-zinc-100 rounded-md w-1/3" />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-3 bg-zinc-100 rounded-md w-full" />
              <div className="h-3 bg-zinc-100 rounded-md w-5/6" />
              <div className="h-3 bg-zinc-100 rounded-md w-4/6" />
            </div>
            <div className="mt-6 flex gap-3 pt-6 border-t border-border">
              <div className="flex-1 h-10 bg-zinc-100 rounded-xl" />
              <div className="flex-1 h-10 bg-zinc-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Gradient Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-bg/75 rounded-2xl" />

      {/* Centered Gate Card */}
      <div className="relative z-10 flex items-center justify-center min-h-[600px] px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl border border-border shadow-2xl overflow-hidden">
            {/* Top accent banner */}
            <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary-light" />

            <div className="p-8 md:p-10 space-y-6">
              {/* Icon & badge */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Users size={38} className="text-primary" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-success rounded-full flex items-center justify-center border-2 border-white">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-accent">
                    Exclusive Member Benefit
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-black text-text leading-tight">
                    Connect with{" "}
                    <span className="text-primary">Verified Professionals</span>{" "}
                    Ready to Help You
                  </h3>
                  <p className="text-text-muted text-[15px] leading-relaxed">
                    As a Smart Citizen, you gain direct access to our network of
                    verified legal advisors, health counselors, educators, and
                    social workers — all volunteering their expertise to
                    uplift our communities, free of charge.
                  </p>
                </div>
              </div>

              {/* Profession Tags */}
              <div className="grid grid-cols-2 gap-3">
                {professionsPreview.map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[13px] font-bold ${color}`}
                  >
                    <Icon size={16} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Social proof */}
              <div className="flex items-center justify-center gap-3 bg-bg rounded-2xl px-5 py-3.5">
                <div className="flex -space-x-2">
                  {[ASSETS.a17, ASSETS.a18, ASSETS.a23].map((src, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full ring-2 ring-white overflow-hidden relative"
                    >
                      <Image
                        src={src}
                        alt="Smart Citizen"
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[13px] text-text-muted font-medium">
                  Join{" "}
                  <span className="font-black text-primary">5,000+ citizens</span>{" "}
                  already making a difference
                </p>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Button asChild variant="primary" size="lg" fullWidth>
                  <Link href="/join_us" className="flex items-center gap-2">
                    Become a Smart Citizen — It&apos;s Free
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="ghost" fullWidth normalCase>
                  <Link
                    href="/member_login"
                    className="text-[14px] text-text-muted"
                  >
                    Already a member?{" "}
                    <span className="text-primary font-bold ml-1">Sign In</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
