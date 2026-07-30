import { PrivacyPolicyMain } from "@/features/public/website/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | GlobalSmart Citizens Foundation",
  description: "Learn about how GlobalSmart Citizens Foundation collects, stores, and protects user data and personal information across our website and services.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyMain />;
}

