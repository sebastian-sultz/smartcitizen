"use client";

import { Card, CardContent } from "@/components/ui/Card";
import {
  Heart,
  UserPlus,
  Award,
  HelpCircle,
  Calendar,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickActionsProps {
  onInviteClick?: () => void;
}

export default function QuickActions({ onInviteClick }: QuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      title: "Make Donation",
      description: "Support water, tree, education, or disaster campaigns",
      icon: Heart,
      iconColor: "text-rose-500 bg-rose-50",
      onClick: () => router.push("/citizen/donations"),
    },
    {
      title: "Invite Friends",
      description: "Grow the network and earn volunteer eligibility",
      icon: UserPlus,
      iconColor: "text-blue-500 bg-blue-50",
      onClick: onInviteClick,
    },
    {
      title: "Apply Volunteer",
      description: "Check eligibility and register for field drives",
      icon: Award,
      iconColor: "text-emerald-500 bg-emerald-50",
      onClick: () => router.push("/citizen/volunteer"),
    },
    {
      title: "Support Desk",
      description: "Open a support ticket or browse frequently asked questions",
      icon: HelpCircle,
      iconColor: "text-amber-500 bg-amber-50",
      onClick: () => router.push("/citizen/support"),
    },
    {
      title: "Edit Profile",
      description: "Manage address details and social connection links",
      icon: User,
      iconColor: "text-purple-500 bg-purple-50",
      onClick: () => router.push("/citizen/profile"),
    },
    {
      title: "Upcoming Events",
      description: "Browse and register for upcoming assemblies",
      icon: Calendar,
      iconColor: "text-indigo-500 bg-indigo-50",
      onClick: () => router.push("/citizen#upcoming-events"),
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-bold text-text px-1">
        Quick Actions
      </h3>

      {/* Mobile view: Slick App-Style Icon Grid (3 Columns) */}
      <div className="grid grid-cols-3 gap-y-6 gap-x-3 p-5 bg-white border border-border shadow-sm rounded-2xl sm:hidden ">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          const mobileLabel =
            act.title === "Make Donation"
              ? "Donate"
              : act.title === "Invite Friends"
                ? "Invite"
                : act.title === "Apply Volunteer"
                  ? "Volunteer"
                  : act.title === "Support Desk"
                    ? "Support"
                    : act.title === "Edit Profile"
                      ? "Profile"
                      : act.title === "Upcoming Events"
                        ? "Events"
                        : act.title;
          return (
            <div
              key={idx}
              className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
              onClick={act.onClick}
            >
              <div className="p-3 rounded-2xl bg-bg border border-border flex items-center justify-center mb-1.5 shadow-sm">
                <Icon size={20} className={act.iconColor.split(" ")[0]} />
              </div>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                {mobileLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Desktop view: Detailed Cards */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <Card
              key={idx}
              className="h-full border-primary/5 hover:border-primary/20 hover:shadow-md hover:scale-[1.02] cursor-pointer transition-all duration-300 rounded-[32px] group"
              onClick={act.onClick}
            >
              <CardContent className="p-5 flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl ${act.iconColor} shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-text group-hover:text-primary transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[12px] text-text-muted leading-relaxed font-medium">
                    {act.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
