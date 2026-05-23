import type { Metadata } from "next";
import { Source_Sans_3, Figtree } from "next/font/google";
import "./globals.css";

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
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



import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertProvider } from "@/components/ui/AlertProvider";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { parseJwt } from "@/lib/auth-token";
import { AuthInitializer } from "@/components/providers/AuthInitializer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const payload = token ? parseJwt(token) : null;
  
  const initialSession = payload
    ? { userId: payload.user_id, userType: payload.user_type }
    : null;

  return (
    <html lang="en" className={`${sourceSans3.variable} ${figtree.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-bg text-text font-body selection:bg-primary selection:text-white flex flex-col">
        <AuthInitializer session={initialSession} />
        <TooltipProvider>
          <AlertProvider>
            {children}
            <Toaster />
          </AlertProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
