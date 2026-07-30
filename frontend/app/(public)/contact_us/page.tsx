import { ContactUsMain } from "@/features/public/website/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | GlobalSmart Citizens Foundation",
  description: "Get in touch with GlobalSmart Citizens Foundation. Reach out to us for enquiries, support, volunteering opportunities, or partnerships.",
};

export default function ContactPage() {
  return <ContactUsMain />;
}

