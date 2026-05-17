import type { Metadata } from "next";
import { Urbanist, Figtree } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const figtree = Figtree({
  variable: "--font-figtree",
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
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} ${figtree.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-bg text-text font-body selection:bg-primary selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
