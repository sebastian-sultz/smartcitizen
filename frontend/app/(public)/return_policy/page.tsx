import { ReturnPolicyMain } from "@/features/public/website/legal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy | GlobalSmart Citizens Foundation",
  description: "Read our terms regarding donations, refunds, returns, and dispute resolutions for transaction-related activities on our platform.",
};

export default function RefundPolicyPage() {
  return <ReturnPolicyMain />;
}

