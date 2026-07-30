import { MissionMain } from "@/features/public/website/mission";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission & Vision | GlobalSmart Citizens Foundation",
  description: "Read about our core values, mission statement, and long-term vision to foster a well-informed, socially responsible, and digitally secure society.",
};

export default function MissionPage() {
  return <MissionMain />;
}

