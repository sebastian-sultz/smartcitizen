"use client";

import { useEffect, useState } from "react";
import { UserResponse } from "@/features/shared/auth/types";
import { Button } from "@/components/ui/Button";
import { Heart, UserPlus, FileText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface WelcomeHeroProps {
  profile: UserResponse | null;
  onInviteClick?: () => void;
}

export default function WelcomeHero({
  profile,
  onInviteClick,
}: WelcomeHeroProps) {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    Promise.resolve().then(() => {
      const hours = new Date().getHours();
      if (hours < 12) {
        setGreeting("Good morning");
      } else if (hours < 17) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    });
  }, []);

  const formattedDate = profile?.created_at
    ? formatDate(profile.created_at, "long-in")
    : "";

  return (
    <div className="relative bg-gradient-to-r from-primary to-[#0e786b] text-white p-5 sm:p-8 md:p-10 rounded-2xl md:rounded-[40px] shadow-lg overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6 md:translate-y-12 md:translate-x-12">
        <Sparkles className="w-36 h-36 md:w-[300px] md:h-[300px]" />
      </div>

      <div className="relative z-10 max-w-3xl space-y-4 md:space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles size={10} className="text-accent" />
            Citizen Portal Active
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {greeting}, {profile?.name || "Citizen"}!
          </h1>
          {formattedDate && (
            <p className="text-white/80 text-xs sm:text-sm md:text-base font-medium">
              Proud member of the foundation since{" "}
              <span className="font-bold text-white">{formattedDate}</span>
            </p>
          )}
        </div>

        <div className="flex flex-row flex-wrap gap-2.5 pt-2">
          {/* Mobile Buttons */}
          <Button
            onClick={() => router.push("/citizen/donations")}
            variant="accent"
            size="sm"
            startIcon={<Heart size={14} fill="currentColor" />}
            className="md:hidden"
          >
            Donate
          </Button>

          <Button
            onClick={onInviteClick}
            variant="outline"
            size="sm"
            startIcon={<UserPlus size={14} />}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white md:hidden"
          >
            Invite
          </Button>

          {/* Desktop Buttons */}
          <Button
            onClick={() => router.push("/citizen/donations")}
            variant="accent"
            size="md"
            startIcon={<Heart size={16} fill="currentColor" />}
            className="hidden md:inline-flex"
          >
            Make Donation
          </Button>

          <Button
            onClick={onInviteClick}
            variant="outline"
            size="md"
            startIcon={<UserPlus size={16} />}
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white hidden md:inline-flex"
          >
            Invite Friends
          </Button>
        </div>
      </div>
    </div>
  );
}
