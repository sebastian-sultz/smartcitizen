import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GlobalSmart Citizens Foundation | Empowering Communities Across India",
  description: "GlobalSmart Citizens Foundation is a registered non-profit empowering citizens through awareness, education, and grassroots action across environment, health, law, and digital safety.",
  keywords: "Non-profit, NGO, Social Change, India, Awareness, Education, Environment, Health, Legal Rights, Digital Safety",
  openGraph: {
    title: "GlobalSmart Citizens Foundation",
    description: "Building a Smarter, Safer, More Aware Society.",
    url: "https://globalsmartcitizensfoundation.org",
    siteName: "GlobalSmart Citizens Foundation",
    locale: "en_IN",
    type: "website",
  },
};

import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="min-h-screen bg-bg text-text font-body selection:bg-primary selection:text-white flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
