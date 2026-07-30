import { AboutMain } from "@/features/public/website/about";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Our Foundation | GlobalSmart Citizens Foundation",
  description: "Learn about GlobalSmart Citizens Foundation, a registered non-profit working towards community empowerment, legal awareness, digital literacy, and sustainable development across India.",
};

export default function AboutPage() {
  return <AboutMain />;
}

