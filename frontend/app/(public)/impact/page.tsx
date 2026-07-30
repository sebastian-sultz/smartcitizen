import { ImpactMain } from "@/features/public/website/impact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Social Impact | GlobalSmart Citizens Foundation",
  description: "Discover the real-world impact of GlobalSmart Citizens Foundation. Learn about our achievements, outreach programs, and active volunteer networks across communities.",
};

export default function ImpactPage() {
  return <ImpactMain />;
}

