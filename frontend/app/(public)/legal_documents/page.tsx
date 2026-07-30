import { LegalDocumentsMain } from "@/features/public/website/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Documents & Certifications | GlobalSmart Citizens Foundation",
  description: "Access the official registration, legal certifications, tax exemptions (80G/12A), and compliance documents of GlobalSmart Citizens Foundation.",
};

export default function LegalDocsPage() {
  return <LegalDocumentsMain />;
}

