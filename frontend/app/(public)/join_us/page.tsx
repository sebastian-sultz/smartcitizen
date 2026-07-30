import { JoinUsMain } from "@/features/shared/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Us as a Member | GlobalSmart Citizens Foundation",
  description: "Become a registered member of the GlobalSmart Citizens Foundation. Join hands with us to advocate for civic rights, community wellness, and positive social reform.",
};

export default function JoinUsPage() {
  return <JoinUsMain />;
}

