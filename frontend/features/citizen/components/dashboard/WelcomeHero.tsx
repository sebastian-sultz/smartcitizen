"use client";

import { useEffect, useState } from "react";
import { UserResponse } from "@/features/auth/types";
import { Button } from "@/components/ui/Button";
import { Heart, UserPlus, FileText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface WelcomeHeroProps {
  profile: UserResponse | null;
  onInviteClick?: () => void;
}

export default function WelcomeHero({ profile, onInviteClick }: WelcomeHeroProps) {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good morning");
    } else if (hours < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const formattedDate = profile?.created_at
    ? formatDate(profile.created_at, "long-in")
    : "";

  return (
    <div className="relative bg-gradient-to-r from-primary to-[#0e786b] text-white p-8 md:p-10 rounded-[40px] shadow-lg overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-12 translate-x-12">
        <Sparkles size={300} />
      </div>

      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} className="text-accent" />
            Citizen Portal Active
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {greeting}, {profile?.name || "Citizen"}!
          </h1>
          {formattedDate && (
            <p className="text-white/80 text-sm md:text-base font-medium">
              Proud member of the foundation since <span className="font-bold text-white">{formattedDate}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={() => router.push("/citizen/donations")}
            className="bg-accent hover:bg-accent/90 text-white font-bold gap-2 px-5 py-3 h-auto rounded-2xl shadow-md border-none"
          >
            <Heart size={16} fill="white" />
            Make Donation
          </Button>

          <Button
            onClick={onInviteClick}
            variant="outline"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold gap-2 px-5 py-3 h-auto rounded-2xl"
          >
            <UserPlus size={16} />
            Invite Friends
          </Button>

          <Button
            onClick={() => router.push("/citizen/donations?tab=tax")}
            variant="outline"
            className="border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold gap-2 px-5 py-3 h-auto rounded-2xl"
          >
            <FileText size={16} />
            Download 80G Tax Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}
