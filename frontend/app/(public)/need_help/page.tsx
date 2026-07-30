import { NeedHelpMain } from "@/features/public/need-help";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Need Help - Emergency Directory | GlobalSmart Citizens Foundation",
  description: "Find resources, counseling services, legal guidance, and community help directories supported by the GlobalSmart Citizens Foundation.",
};

export default function NeedHelpPage() {
  return <NeedHelpMain />;
}



