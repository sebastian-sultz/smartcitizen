import { OurWorkMain } from "@/features/citizen/community";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Programs & Outreach | GlobalSmart Citizens Foundation",
  description: "Read about our 15 key social dimensions, including road safety, consumer rights, child rights protection, basic financial literacy, and digital safety programs.",
};

export default function ProgramsPage() {
  return <OurWorkMain />;
}

