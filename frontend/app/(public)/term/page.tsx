import { TermsMain } from "@/features/public/website/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | GlobalSmart Citizens Foundation",
  description: "Read the official terms and conditions for using the GlobalSmart Citizens Foundation website, portals, services, and participating in campaigns.",
};

export default function TermsPage() {
  return <TermsMain />;
}

