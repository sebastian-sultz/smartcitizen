"use client";

import { useState } from "react";
import { MoveRight, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export function DonationCTA() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-bg-alt overflow-hidden">
      <div className="max-content">
        <div className="max-w-3xl mx-auto text-center space-y-8 p-8 md:p-12 bg-white border border-border/80 rounded-[40px] shadow-card relative">
          {/* Decorative Subtle Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20">
            <Heart size={20} fill="currentColor" />
          </div>

          <div className="space-y-4">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-accent block mt-2">
              MAKE A DIFFERENCE
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-black text-text leading-tight tracking-tight">
              Support Our Civic Initiatives
            </h2>
            <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Every contribution helps us power neighborhood assemblies, deploy
              local community tools, and clean up our environment.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {/* Amount Presets */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  variant={selectedAmount === amount ? "accent" : "secondary"}
                  key={amount}
                  shape="pill"
                  size="sm"
                  noShadow
                  normalCase
                  className="transition-all"
                  onClick={() => setSelectedAmount(amount)}
                >
                  ₹{amount.toLocaleString("en-IN")}
                </Button>
              ))}
              <Button
                asChild
                variant="secondary"
                shape="pill"
                size="sm"
                noShadow
                normalCase
              >
                <Link href="/donation">Other Amount</Link>
              </Button>
            </div>

            {/* Core Action Link */}
            <div className="pt-2">
              <Button
                asChild
                variant="accent"
                size="lg"
                className="transition-all transform hover:-translate-y-0.5"
              >
                <Link
                  href={
                    selectedAmount
                      ? `/donation?amount=${selectedAmount}`
                      : "/donation"
                  }
                >
                  Contribute Now{" "}
                  <MoveRight size={16} className="ml-2.5 inline" />
                </Link>
              </Button>
            </div>

            <p className="text-[11px] text-text-light leading-relaxed max-w-lg mx-auto italic">
              All contributions are voluntary and fully eligible for tax
              deduction benefits under Section 80G of the Income Tax Act.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
