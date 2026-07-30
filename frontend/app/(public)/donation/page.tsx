import { DonationMain } from "@/features/public/donation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Our Cause - Donate | GlobalSmart Citizens Foundation",
  description: "Make a contribution to GlobalSmart Citizens Foundation. Your donations support clean environment initiatives, children's rights, health wellness programs, and legal aid.",
};

export default function DonationPage() {
  return <DonationMain />;
}

