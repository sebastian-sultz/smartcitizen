import { InitiativesMain } from "@/features/citizen/community";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Initiatives | GlobalSmart Citizens Foundation",
  description: "Explore our strategic initiatives aimed at building a smarter, safer, and more connected community through digital literacy, civic education, and environmental sustainability.",
};

export default function InitiativesPage() {
  return <InitiativesMain />;
}
